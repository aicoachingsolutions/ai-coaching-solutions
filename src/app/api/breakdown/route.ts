import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  return new OpenAI({ apiKey });
}

const BreakdownRequestSchema = z.object({
  sport: z.enum(["golf", "baseball", "softball"]),
  motion: z.enum(["swing", "pitching"]),
  // Optional: link may be inaccessible; we treat it as reference context only
  videoLink: z.string().url().optional().or(z.literal("")).default(""),
  ageGroup: z.string().optional().default(""),
  skillLevel: z.string().optional().default(""),
  // Require meaningful context so we don’t “guess off a link”
  mainIssue: z.string().min(20, "Please describe what you’re seeing (at least 20 characters)."),
});

const BreakdownSchema = z.object({
  mechanics: z.string(),
  timing: z.string(),
  cues: z.array(z.string()).min(3).max(8),
  nextFocus: z.string(),
  drill: z.string(),
});

type Breakdown = z.infer<typeof BreakdownSchema>;

/**
 * Best-effort dev-safe rate limit (not perfect on serverless).
 * For production-grade rate limiting we can swap this for Upstash/Vercel KV later.
 */
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

    // IP for best-effort rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rl = rateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a minute." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const json = await req.json();
    const parsed = BreakdownRequestSchema.safeParse(json);

    if (!parsed.success) {
      const message =
        parsed.error.issues?.[0]?.message || "Invalid request. Please check your inputs.";
      return NextResponse.json(
        { error: message, details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sport, motion, videoLink, ageGroup, skillLevel, mainIssue } = parsed.data;

    const ANALYZER_INSTRUCTIONS = `
You are a coaching-first ${sport} ${motion} mechanics assistant.

Tone:
- Calm
- Practical
- Direct
- No hype
- Built by a coach for coaches

Critical honesty:
- You cannot watch or view external video links.
- Do not claim you watched the clip.
- Use the athlete info + the described issue to generate a best-effort coaching breakdown.

If the description is missing key details, ask for what’s missing INSIDE the JSON fields (especially cues and nextFocus) instead of guessing.

Output MUST be valid JSON matching the schema.

Include:
- mechanics (3–6 sentences)
- timing (2–4 sentences)
- cues (3–8 short cue strings)
- nextFocus (2–4 sentences with one clear priority)
- drill (2–4 sentences describing ONE specific drill that directly trains nextFocus; include setup + reps + coaching cue)
`.trim();

    const userInput = `
Sport: ${sport}
Motion: ${motion}
Video link (may not be accessible): ${videoLink || "(not provided)"}
Age group: ${ageGroup || "(not provided)"}
Skill level: ${skillLevel || "(not provided)"}
What they’re seeing: ${mainIssue}

Task:
Create a structured coaching breakdown based on the description above.
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
        {
          error: "Model returned invalid JSON. Please try again.",
          raw: content.slice(0, 2000),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { result: data },
      {
        headers: {
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}