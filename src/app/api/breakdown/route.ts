import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

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

const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  hits.set(ip, entry);
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rl = rateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
        }
      );
    }

    const json = await req.json();
    const parsed = BreakdownRequestSchema.safeParse(json);

    if (!parsed.success) {
      const message =
        parsed.error.issues?.[0]?.message || "Invalid request. Please check your inputs.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { sport, motion, handedness, ageGroup, skillLevel, mainIssue } = parsed.data;

    if (hasInjection(mainIssue)) {
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
      return NextResponse.json(
        { error: "Model returned invalid JSON. Please try again.", raw: content.slice(0, 2000) },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { result: data },
      { headers: { "X-RateLimit-Remaining": String(rl.remaining) } }
    );
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
