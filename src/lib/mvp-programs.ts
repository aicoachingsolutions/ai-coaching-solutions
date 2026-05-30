/**
 * MVP / founding-user program copy — shared across marketing pages.
 */

export type MvpExtensionTier = {
  label: string;
  contribution: string;
  reward: string;
};

export type MvpProgramDefinition = {
  badge: string;
  headline: string;
  intro: string;
  proIncludesTitle: string;
  proIncludes: string[];
  youGetTitle: string;
  youGet: string[];
  weAskTitle: string;
  weAsk: string[];
  extensionTiers?: MvpExtensionTier[];
  extensionNote?: string;
  afterProgram: string;
  earlyAccessNote: string;
  notFitFor: string;
};

export const BREAK90_FOUNDING_GOLFER_PROGRAM: MvpProgramDefinition = {
  badge: "Founding golfer program",
  headline: "Break90 Pro free for 60 days — help us build the coach golfers actually use",
  intro:
    "You get every Pro feature for 60 days at no charge. We are looking for golfers who use Break90 after real rounds, tell us what helped and what did not, and complete short check-ins so we can ship what matters.",
  proIncludesTitle: "What Pro includes during your access",
  proIncludes: [
    "Full round tracking and scoring-pattern analysis",
    "Personalized practice priorities after each round",
    "Clear coaching feedback between rounds — not generic stats",
    "All Pro features with no limits during your access period",
  ],
  youGetTitle: "What you get",
  youGet: [
    "60 days of Break90 Pro — full access",
    "Founding golfer status while the program is open",
    "Direct product feedback channel (in-app + email)",
    "Reminders 14 and 7 days before Pro access ends",
  ],
  weAskTitle: "What we ask",
  weAsk: [
    "Log at least 2 rounds in your first 30 days (real rounds, not demo data)",
    "Complete one structured feedback check-in after your first week",
    "Complete one check-in before day 60",
    "Flag bugs when something breaks — optional 15-minute call if we invite you",
  ],
  extensionTiers: [
    {
      label: "Base",
      contribution: "Join and finish onboarding",
      reward: "60 days Pro",
    },
    {
      label: "+30 days",
      contribution: "4+ rounds logged and both check-ins completed",
      reward: "90 days total",
    },
    {
      label: "+30 more",
      contribution:
        "One reproducible bug report with steps, or one feedback call, or one referred golfer who completes onboarding",
      reward: "120 days total (max)",
    },
  ],
  extensionNote:
    "Extensions are automatic when milestones are met — no subjective scoring of your feedback. Maximum free Pro access is 120 days, then standard pricing applies unless we offer a founding discount.",
  afterProgram:
    "After your access ends, you can upgrade to Pro or continue on Free if a free tier is available. We will never charge you without clear notice.",
  earlyAccessNote:
    "MVP testing is not open yet on this site. Join the waitlist below — when we open the first cohort, you will get instructions to start your 60-day Pro access.",
  notFitFor:
    "This program is not a fit if you need a finished, support-heavy product today. Features may change weekly during MVP — that is the trade for extended free Pro access.",
};

export const PRACTICE_PLANNER_COACH_PROGRAM: MvpProgramDefinition = {
  badge: "Founding coach program",
  headline:
    "Practice Planner Pro free for 60 days — help us build planning coaches actually use",
  intro:
    "You get every Pro feature for 60 days at no charge. We are looking for coaches who run real practices, build plans they would actually use on the field, and tell us what saves time versus what gets in the way.",
  proIncludesTitle: "What Pro includes during your access",
  proIncludes: [
    "Unlimited saved practice plans",
    "Drill library — add, edit, and reuse your drills",
    "Offensive, defensive, and full-practice structures",
    "Team setup and plan editing without artificial caps during MVP",
    "All Pro features with no limits during your access period",
  ],
  youGetTitle: "What you get",
  youGet: [
    "60 days of Practice Planner Pro — full access",
    "Founding coach status while the program is open",
    "Direct product feedback channel (in-app + email)",
    "Reminders 14 and 7 days before Pro access ends",
  ],
  weAskTitle: "What we ask",
  weAsk: [
    "Create at least 2 real practice plans in your first 30 days (plans you would run, not demos)",
    "Complete one structured feedback check-in after your first week",
    "Complete one check-in before day 60",
    "Flag bugs when something breaks — optional 15-minute call if we invite you",
  ],
  extensionTiers: [
    {
      label: "Base",
      contribution: "Join and finish onboarding",
      reward: "60 days Pro",
    },
    {
      label: "+30 days",
      contribution: "3+ saved practice plans and both check-ins completed",
      reward: "90 days total",
    },
    {
      label: "+30 more",
      contribution:
        "One reproducible bug report with steps, or one feedback call, or one referred coach who completes onboarding",
      reward: "120 days total (max)",
    },
  ],
  extensionNote:
    "Extensions are automatic when milestones are met — no subjective scoring of your feedback. Maximum free Pro access is 120 days, then standard pricing applies unless we offer a founding discount.",
  afterProgram:
    "After your access ends, you can upgrade to Pro or continue on Free if a free tier is available. We will never charge you without clear notice.",
  earlyAccessNote:
    "MVP testing is not open yet on this site. Join the waitlist below — when we open the first coach cohort, you will get instructions to start your 60-day Pro access.",
  notFitFor:
    "This program is for coaches running baseball or softball practices — not for golfers (see Break90). Not a fit if you need a finished, support-heavy product today; features may change weekly during MVP.",
};
