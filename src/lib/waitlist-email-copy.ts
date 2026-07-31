/**
 * Waitlist / signup email copy by form source.
 * Used by /api/contact for internal notifications and user confirmations.
 */

export type WaitlistSource =
  | "mvp-practice-planner"
  | "mvp-break90"
  | "app-home-early-access"
  | "tools-page"
  | "fb-tiktok-coaching-lines"
  | string;

/** Hub site owns www (app. is Practice Planner). */
const PDF_DOWNLOAD_URL =
  "https://www.aicoachingsolutions.net/downloads/the-lines-coaches-never-forget.pdf";

type WaitlistEmailContent = {
  toolLabel: string;
  internalSubject: string;
  confirmationSubject: string;
  confirmationLines: string[];
};

const COPY_BY_SOURCE: Record<string, WaitlistEmailContent> = {
  "mvp-practice-planner": {
    toolLabel: "Practice Planner (founding coach program)",
    internalSubject: "New waitlist: Practice Planner founding coach",
    confirmationSubject: "You are on the Practice Planner waitlist — AI Coaching Solutions",
    confirmationLines: [
      "Thanks for joining the Practice Planner founding coach waitlist.",
      "",
      "You signed up for early access to Practice Planner — our lead coaching tool for building real practices. When we open the first coach cohort, you will get instructions to start your 60 days of Pro free.",
      "",
      "What we will ask founding coaches: create real practice plans, complete two short feedback check-ins, and help shape what we ship.",
      "",
      "We will email you when MVP access opens. No charge to join the waitlist.",
      "",
      "AI Coaching Solutions",
      "app.aicoachingsolutions.net/practice-planner",
    ],
  },
  "mvp-break90": {
    toolLabel: "Break90 Golf (founding golfer program)",
    internalSubject: "New waitlist: Break90 Golf founding golfer",
    confirmationSubject: "You are on the Break90 Golf waitlist — AI Coaching Solutions",
    confirmationLines: [
      "Thanks for joining the Break90 Golf founding golfer waitlist.",
      "",
      "You signed up for early access to Break90 — your AI golf coach between rounds. When we open the first golfer cohort, you will get instructions to start your 60 days of Pro free.",
      "",
      "What we will ask founding golfers: log real rounds, complete two short feedback check-ins, and tell us if the coaching is actually helping your game.",
      "",
      "We will email you when MVP access opens. No charge to join the waitlist.",
      "",
      "AI Coaching Solutions",
      "app.aicoachingsolutions.net/break90",
    ],
  },
  "app-home-early-access": {
    toolLabel: "Early access (Practice Planner or Break90 — home page)",
    internalSubject: "New waitlist: early access (home page — either tool)",
    confirmationSubject: "You are on the early access waitlist — AI Coaching Solutions",
    confirmationLines: [
      "Thanks for joining the AI Coaching Solutions early access waitlist.",
      "",
      "You are on the list for founding program access when we open:",
      "• Practice Planner — for coaches (baseball / softball), 60 days of Pro free",
      "• Break90 Golf — for golfers, 60 days of Pro free",
      "",
      "We will email you when the first cohorts open. You can pick the program that fits you, or both.",
      "",
      "Free Swing Analyzer is live now — no waitlist required.",
      "",
      "Program details:",
      "app.aicoachingsolutions.net/practice-planner",
      "app.aicoachingsolutions.net/break90",
      "",
      "AI Coaching Solutions",
    ],
  },
  "tools-page": {
    toolLabel: "Early access (Practice Planner or Break90 — tools page)",
    internalSubject: "New waitlist: early access (tools page — either tool)",
    confirmationSubject: "You are on the early access waitlist — AI Coaching Solutions",
    confirmationLines: [
      "Thanks for joining the AI Coaching Solutions early access waitlist.",
      "",
      "You are on the list for founding program access when we open:",
      "• Practice Planner — for coaches (baseball / softball), 60 days of Pro free",
      "• Break90 Golf — for golfers, 60 days of Pro free",
      "",
      "We will email you when the first cohorts open.",
      "",
      "Free Swing Analyzer is live now on the app site.",
      "",
      "AI Coaching Solutions",
    ],
  },
  "fb-tiktok-coaching-lines": {
    toolLabel: "PDF lead: The Lines Coaches Never Forget",
    internalSubject: "New PDF lead: The Lines Coaches Never Forget",
    confirmationSubject: "Your 101 lines are here",
    confirmationLines: [], // built specially below
  },
};

const DEFAULT_WAITLIST: WaitlistEmailContent = {
  toolLabel: "General waitlist",
  internalSubject: "New waitlist signup",
  confirmationSubject: "You are on the list — AI Coaching Solutions",
  confirmationLines: [
    "Thanks for joining our waitlist.",
    "",
    "We will email you when early access opens for our coaching tools.",
    "",
    "AI Coaching Solutions",
  ],
};

export function getWaitlistEmailContent(source: WaitlistSource): WaitlistEmailContent {
  return COPY_BY_SOURCE[source] ?? DEFAULT_WAITLIST;
}

export function buildWaitlistConfirmationText(
  source: WaitlistSource,
  email: string,
  firstName?: string,
  extras?: { coachingAudience?: string; sport?: string }
): { subject: string; text: string; internalSubject: string; internalText: string } {
  const content = getWaitlistEmailContent(source);

  let confirmationText: string;
  if (source === "fb-tiktok-coaching-lines") {
    const thanks = firstName
      ? `Thanks for grabbing this, ${firstName}.`
      : "Thanks for grabbing this.";
    confirmationText = [
      thanks,
      "",
      "Here's your download:",
      PDF_DOWNLOAD_URL,
      "",
      "101 lines, collected from 2,280 coaches, players and parents who answered one question: what's a line your old coach said that you still catch yourself saying?",
      "",
      "None of them are mine. They're sorted by the moment you'd actually reach for them — when a kid makes a mistake, when the effort drops, when it gets hard. Use the ones that sound like you and ignore the rest.",
      "",
      "One thing before you go. Hit reply and tell me the line you still catch yourself saying — the one somebody said to you once that never left. I read every reply, and I'm collecting them for the next one.",
      "",
      "Coach V",
      "AI Coaching Solutions — Building Better Coaches",
    ].join("\n");
  } else {
    const greeting = firstName ? `Hi ${firstName},` : "Hello,";
    confirmationText = [greeting, "", ...content.confirmationLines].join("\n");
  }

  const internalText = [
    `Tool / program: ${content.toolLabel}`,
    `Source key: ${source}`,
    `Email: ${email}`,
    firstName ? `First name: ${firstName}` : "",
    extras?.coachingAudience ? `What do you coach?: ${extras.coachingAudience}` : "",
    extras?.sport ? `Sport: ${extras.sport}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: content.confirmationSubject,
    text: confirmationText,
    internalSubject: content.internalSubject,
    internalText,
  };
}
