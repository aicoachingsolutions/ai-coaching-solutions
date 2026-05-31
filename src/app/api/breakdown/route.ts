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

// Sport- and motion-specific coaching frameworks the model reasons from.
// This is what makes the output read like a real coach instead of generic AI.
const FRAMEWORKS: Record<string, string> = {
  baseball_swing: `
Kinetic sequence (ground up): load & hand set -> stride with hip/hand separation -> lower half launches (back hip rotates into a firm front leg) -> torso follows -> lead arm pulls the barrel into the slot -> palm-up/palm-down through contact -> extension to a high finish.
Common fault -> root cause: rolling over / weak grounders = casting or early wrist roll from the upper half rushing; pulling off / opening early = front shoulder and hip flying open together with no separation; chopping or swinging under = steep, disconnected barrel; lunging = drifting onto a soft front leg.
Recognized drills: tee work (inside/outside, high/low tee), bottom-hand & top-hand isolation, connection ball or towel-under-lead-arm, walk-through stride drill, wall drill (no barrel contact), high-tee for steep swings, timed soft toss, band-resisted hip turn.`,

  softball_swing: `
Kinetic sequence (ground up): load & hand set -> short stride with hip/hand separation -> back hip rotates into a firm front leg -> torso follows -> lead arm pulls the barrel into the slot -> through contact -> extension and finish. Reaction window is short, so emphasize staying short to the ball and adjusting to pitch height (rise/drop/change).
Common fault -> root cause: rolling over / weak grounders = casting or early wrist roll from rushing the hands; pulling off the ball = front side flying open with no separation; late / beaten by rise = long, steep path or late launch; lunging = drifting onto a soft front side.
Recognized drills: tee work (inside/outside, high/low tee), bottom-hand & top-hand isolation, connection ball or towel-under-lead-arm, walk-through stride drill, wall drill, high-tee for steep swings, timed front toss, band-resisted hip turn.`,

  baseball_pitching: `
This is OVERHAND pitching. Kinetic sequence: balanced leg lift -> controlled descent into the legs -> directional stride to the plate -> hip-to-shoulder separation (hips open while the throwing shoulder stays back) -> trunk rotation -> arm acceleration to release -> deceleration over a firm, braced front leg -> follow-through.
Common fault -> root cause: ball up / loss of command = rushing (upper half beats the lower half) or a soft, early-landing front leg; arm drag or low slot = late arm and poor hip-shoulder separation; flying open = glove side pulling out early and head drifting off line; inconsistent release = an unstable front-side block.
Recognized drills: towel drill, wall / front-side drill, balance-point holds, hip-shoulder separation ("sit and rip"), med-ball rotational throws and overhead slams, one-knee and rocker throws, walking windups, glove-side block drill.`,

  softball_pitching: `
This is WINDMILL (underhand) pitching — do NOT give overhand cues. Kinetic sequence: presentation -> explosive drive off the rubber (long stride, stay low) -> full windmill arm circle (arm long and loose, no elbow bend) -> hips fire and internally rotate as the arm comes down -> brush contact at the hip with a fast wrist/forearm snap -> snap through release -> balanced follow-through as the back foot replants.
Common fault -> root cause: lost velocity / "muscling" = bending the elbow in the circle or no leg drive (arm-only); rise or drop won't break = no hip snap or no brush contact at release; control issues = hips opening too early or inconsistent stride direction.
Recognized drills: K-position / "K-drill," wall arm-circle isolation, wrist- and forearm-snap drills at the hip, figure-8s, one-knee snaps, brush-the-hip drill (tape/chalk on the hip), resistance-band internal rotation, full-motion walk-throughs.`,

  golf_swing: `
Reason in terms of swing plane, club path, and clubface — not just where the ball ends up. Sequence & checkpoints: grip/setup/alignment -> one-piece takeaway -> wrist set on plane -> transition led by the lower body -> downswing with hips clearing while the club drops to the inside -> square face at impact with hands ahead (shaft lean) -> extension -> balanced finish.
Common fault -> root cause: slice / pull = over-the-top, out-to-in path from the upper body starting the downswing; fat or thin = early extension (standing up, losing posture) or casting / early release; sway or slide = lateral lower-body movement instead of rotation; flip = hands releasing early and losing shaft lean at impact.
Recognized drills: alignment-stick path/plane drills, headcover-outside-the-ball (anti-over-the-top), towel-under-both-arms connection, pump drill for transition, impact bag, feet-together drill for sequencing/balance, split-grip drill, lead-arm-only swings, step drill for ground-up sequencing.`,
};

function getFramework(sport: string, motion: string): string {
  return (
    FRAMEWORKS[`${sport}_${motion}`] ??
    `Reason from the sport's natural kinetic sequence (ground up), diagnose the earliest breakdown in that chain, and prescribe a recognized, sport-appropriate drill.`
  ).trim();
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

    const framework = getFramework(sport, motion);
    const athleteProfile = `${ageGroup || "a developing"} athlete at a ${skillLevel || "developing"} level`;

    const ANALYZER_INSTRUCTIONS = `
You are a national-level ${sport} ${motion} coach and biomechanics specialist. A fellow coach has described what they are seeing with an athlete. Give them a breakdown sharp enough to run practice off it tonight.

HOW YOU THINK (reason from this sport framework):
${framework}

COACHING RUBRIC:
- Diagnose the ROOT CAUSE, not the symptom. Most described faults are downstream of one earlier breakdown in the kinetic sequence — find that link and lead with it.
- Trace the cause-and-effect chain explicitly (e.g., "X happens, which forces Y, producing the Z the coach described").
- Calibrate everything — rep counts, vocabulary, how much to cue at once — to ${athleteProfile}.
- Make cues FELT, not just seen: tie each to a sensation in the hands, hips, feet, barrel, or clubface.

WHAT TO AVOID:
- Generic cues that fit any athlete ("stay back," "see the ball," "be athletic," "keep your head down") unless anchored to a specific feel or checkpoint.
- Hedging ("might," "could be," "sometimes"). Commit to the most likely root cause. If the description is thin, name the most common cause for that pattern and state the one thing to confirm in person.
- Trying to fix five things. Give ONE priority.

OUTPUT — valid JSON only:
- mechanics (4–6 sentences): the root cause and how it cascades into what the coach described; name exact joints, segments, and where in the sequence it breaks.
- timing (2–4 sentences): where in the kinetic sequence the timing breaks down, and what correct timing should feel like.
- cues (4–7 strings): short, vivid, athlete-facing — what a coach actually says mid-rep; mix feel cues and positional cues.
- nextFocus (2–4 sentences): the single highest-leverage fix and why correcting it unlocks the rest.
- drill (4–6 sentences): name an established, recognizable drill (or describe one concretely). Include setup + equipment, a rep/set count appropriate for ${athleteProfile}, the ONE thing to watch for, one sentence on WHY it targets this specific root cause, and a simple progression once the athlete succeeds.
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
      model: "gpt-5.4-mini-2026-03-17",
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
