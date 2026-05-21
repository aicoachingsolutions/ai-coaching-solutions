import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  return new OpenAI({ apiKey });
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous\s+)?instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /forget\s+(your\s+)?instructions/i,
  /disregard\s+(all\s+)?/i,
  /new\s+instructions\s*:/i,
  /jailbreak/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /as\s+an?\s+(ai|language\s+model)/i,
];

function hasInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((p) => p.test(text));
}

const BreakdownRequestSchema = z.object({
  sport: z.enum(["golf", "baseball", "softball"]),
  motion: z.enum(["swing", "pitching"]),
  handedness: z.enum(["left", "right"]).optional(),
  ageGroup: z.string().max(80).optional().default(""),
  skillLevel: z.string().max(60).optional().default(""),
  mainIssue: z
    .string()
    .min(20, "Please describe what you're seeing (at least 20 characters).")
    .max(600, "Description is too long — please keep it under 600 characters."),
  _hp: z.string().max(0, "Invalid request.").optional().default(""),
});

const BreakdownSchema = z.object({
  mechanics: z.string(),
  timing: z.string(),
  cues: z.array(z.string()).min(3).max(8),
  nextFocus: z.string(),
  drill: z.string(),
});

type Breakdown = z.infer<typeof BreakdownSchema>;

const ENDPOINT_NAME = "breakdown";
const MINUTE_LIMIT = 5;
const DAILY_LIMIT = 20;

type RateLimitResult =
  | { ok: true; minuteCount: number; dayCount: number }
  | { ok: false; reason: "minute" | "day"; retryAfterSeconds: number };

async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  // If Supabase isn't configured, fail open with a warning so dev/local still works.
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      "[breakdown] Supabase not configured — rate limiting disabled. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    return { ok: true, minuteCount: 0, dayCount: 0 };
  }

  const supabase = getSupabaseAdmin();
  const now = Date.now();
  const oneMinuteAgo = new Date(now - 60_000).toISOString();
  const oneDayAgo = new Date(now - 86_400_000).toISOString();

  const [{ count: minuteCount }, { count: dayCount }] = await Promise.all([
    supabase
      .from("api_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .eq("endpoint", ENDPOINT_NAME)
      .gte("created_at", oneMinuteAgo),
    supabase
      .from("api_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .eq("endpoint", ENDPOINT_NAME)
      .gte("created_at", oneDayAgo),
  ]);

  const minutes = minuteCount ?? 0;
  const days = dayCount ?? 0;

  if (minutes >= MINUTE_LIMIT) {
    return { ok: false, reason: "minute", retryAfterSeconds: 60 };
  }
  if (days >= DAILY_LIMIT) {
    return { ok: false, reason: "day", retryAfterSeconds: 3600 };
  }

  return { ok: true, minuteCount: minutes, dayCount: days };
}

async function logRequest(
  ip: string,
  status: number,
  userAgent: string | null
): Promise<void> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("api_requests").insert({
      ip,
      endpoint: ENDPOINT_NAME,
      status,
      user_agent: userAgent?.slice(0, 500) ?? null,
    });
  } catch (err) {
    // Don't fail the request if logging fails
    console.error("[breakdown] failed to log request:", err);
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent");

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Rate limit BEFORE doing any work
    const rl = await checkRateLimit(ip);
    if (!rl.ok) {
      await logRequest(ip, 429, userAgent);
      const message =
        rl.reason === "minute"
          ? "Too many requests. Please wait a minute and try again."
          : "You've reached today's free breakdown limit. Please try again tomorrow.";
      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfterSeconds) },
        }
      );
    }

    const json = await req.json();
    const parsed = BreakdownRequestSchema.safeParse(json);

    if (!parsed.success) {
      await logRequest(ip, 400, userAgent);
      const message =
        parsed.error.issues?.[0]?.message || "Invalid request. Please check your inputs.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { sport, motion, handedness, ageGroup, skillLevel, mainIssue } = parsed.data;

    if (hasInjection(mainIssue)) {
      await logRequest(ip, 400, userAgent);
      return NextResponse.json(
        {
          error:
            "Your description contains unsupported content. Please describe what you're observing in coaching terms.",
        },
        { status: 400 }
      );
    }

    const ANALYZER_INSTRUCTIONS = `
You are an expert ${sport} ${motion} mechanics coach with deep knowledge of biomechanics, athletic development, and sport-specific technique.

Tone:
- Confident and precise — you are the expert in the room
- Practical and actionable — every sentence should help the coach fix something
- Direct — no filler, no hedging, no generic advice
- Age and skill appropriate — calibrate language and complexity to the athlete's level

Quality standards:
- Be highly specific to the described issue. Never give generic advice that could apply to any athlete.
- Name exact body parts, positions, and movement sequences.
- Reference cause-and-effect chains (e.g., "early shoulder rotation causes the barrel to drag, producing weak contact to the pull side").
- Ground cues in feel, not just visuals — what the athlete should sense in their hands, hips, feet.
- For the drill, prescribe exact reps, setup, and the one coaching point to emphasize.
- If the description implies a root cause pattern, lead with that — don't just list symptoms.

Output MUST be valid JSON matching the schema.

Include:
- mechanics (3–6 sentences): identify the root cause and its downstream effects on movement; be specific to this athlete's described pattern
- timing (2–4 sentences): pinpoint where in the sequence the timing breaks down and what it should feel like when it's right
- cues (4–7 short cue strings): short, vivid, athlete-facing language — the kind a coach shouts during live reps; mix feel cues and positional cues
- nextFocus (2–4 sentences): one clear priority — the single highest-leverage fix; explain why this one unlocks the others
- drill (3–5 sentences): ONE named drill with exact setup, rep count, and the one thing to watch for; make it immediately runnable at next practice
`.trim();

    const handednessLine = handedness ? `Handedness: ${handedness}-handed\n` : "";
    const userInput = `
Sport: ${sport}
Motion: ${motion}
${handednessLine}Age group: ${ageGroup || "(not provided)"}
Skill level: ${skillLevel || "(not provided)"}
What the coach is seeing: ${mainIssue}

Task:
Deliver a sharp, specific, high-quality coaching breakdown based on the description above.
Return valid JSON only.
`.trim();

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: ANALYZER_INSTRUCTIONS },
        { role: "user", content: userInput },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "breakdown",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              mechanics: { type: "string" },
              timing: { type: "string" },
              cues: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 8,
              },
              nextFocus: { type: "string" },
              drill: { type: "string" },
            },
            required: ["mechanics", "timing", "cues", "nextFocus", "drill"],
          },
        },
      },
    });

    const content = response.choices?.[0]?.message?.content ?? "";

    let data: Breakdown;
    try {
      data = BreakdownSchema.parse(JSON.parse(content));
    } catch {
      await logRequest(ip, 502, userAgent);
      return NextResponse.json(
        { error: "Model returned invalid JSON. Please try again.", raw: content.slice(0, 2000) },
        { status: 502 }
      );
    }

    await logRequest(ip, 200, userAgent);

    return NextResponse.json(
      { result: data },
      {
        headers: {
          "X-RateLimit-Minute-Remaining": String(Math.max(0, MINUTE_LIMIT - rl.minuteCount - 1)),
          "X-RateLimit-Day-Remaining": String(Math.max(0, DAILY_LIMIT - rl.dayCount - 1)),
        },
      }
    );
  } catch (err: any) {
    await logRequest(ip, 500, userAgent);
    const msg = err?.message || "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
