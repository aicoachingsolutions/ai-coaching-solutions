import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/lib/smtp-config";

type BreakdownResult = {
  mechanics: string;
  timing: string;
  cues: string[];
  nextFocus: string;
  drill: string;
};

type Payload = {
  email: string;
  source?: string;
  sport?: string;
  motion?: string;
  ageGroup?: string;
  skillLevel?: string;
  mainIssue?: string;
  result?: BreakdownResult;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const email = clean(body.email).toLowerCase();
    const result = body.result;

    if (!isValidEmail(email)) {
      return Response.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (
      !result ||
      !clean(result.mechanics) ||
      !clean(result.timing) ||
      !Array.isArray(result.cues) ||
      result.cues.length === 0 ||
      !clean(result.nextFocus) ||
      !clean(result.drill)
    ) {
      return Response.json({ error: "Breakdown result is incomplete" }, { status: 400 });
    }

    const { host, port, secure, user, pass, from, to, missing } = getSmtpConfig();

    if (missing.length > 0) {
      return Response.json({ error: "Email service is not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const sessionLines = [
      `Sport: ${clean(body.sport) || "Not provided"}`,
      `Motion: ${clean(body.motion) || "Not provided"}`,
      `Age group: ${clean(body.ageGroup) || "Not provided"}`,
      `Skill level: ${clean(body.skillLevel) || "Not provided"}`,
      `Main issue: ${clean(body.mainIssue) || "Not provided"}`,
    ];

    const cues = result.cues.map((cue) => `- ${clean(cue)}`).join("\n");

    const breakdownBody = [
      "Here’s your breakdown. Use as a coaching draft and confirm in-person.",
      "",
      "Session",
      ...sessionLines,
      "",
      "Mechanics",
      clean(result.mechanics),
      "",
      "Timing",
      clean(result.timing),
      "",
      "Coaching cues",
      cues,
      "",
      "Next focus",
      clean(result.nextFocus),
      "",
      "Recommended drill",
      clean(result.drill),
      "",
      "You’ll also receive occasional coach notes. Unsubscribe anytime.",
    ].join("\n");

    await transporter.sendMail({
      from,
      to: email,
      subject: "Your AI Coaching Breakdown",
      text: breakdownBody,
    });

    await transporter.sendMail({
      from,
      to,
      subject: "Free Breakdown emailed",
      text: [
        `Source: ${clean(body.source) || "free-breakdown"}`,
        `Email: ${email}`,
        `Sport: ${clean(body.sport) || "Not provided"}`,
        `Motion: ${clean(body.motion) || "Not provided"}`,
      ].join("\n"),
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
