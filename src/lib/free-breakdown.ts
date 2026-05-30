export const BREAKDOWN_SPORTS = ["baseball", "softball", "golf"] as const;
export const BREAKDOWN_MOTIONS = ["swing", "pitching"] as const;

export type BreakdownSport = (typeof BREAKDOWN_SPORTS)[number];
export type BreakdownMotion = (typeof BREAKDOWN_MOTIONS)[number];

export type BreakdownResult = {
  mechanics: string;
  timing: string;
  cues: string[];
  nextFocus: string;
  drill: string;
};

export const BREAKDOWN_MOTION_OPTIONS: Record<
  BreakdownSport,
  Array<{ value: BreakdownMotion; label: string }>
> = {
  baseball: [
    { value: "swing", label: "Swing / Hitting" },
    { value: "pitching", label: "Pitching" },
  ],
  softball: [
    { value: "swing", label: "Swing / Hitting" },
    { value: "pitching", label: "Pitching" },
  ],
  golf: [{ value: "swing", label: "Swing" }],
};

export function defaultMotionForSport(sport: BreakdownSport): BreakdownMotion {
  return BREAKDOWN_MOTION_OPTIONS[sport][0].value;
}

export function isMotionAllowedForSport(
  sport: BreakdownSport,
  motion: BreakdownMotion
): boolean {
  return BREAKDOWN_MOTION_OPTIONS[sport].some((option) => option.value === motion);
}

function cleanText(value: string) {
  return (value || "").trim();
}

function formatLabel(value: string) {
  if (!value) return "Not provided";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function buildBreakdownText(params: {
  sport: BreakdownSport;
  motion: BreakdownMotion;
  ageGroup: string;
  skillLevel: string;
  mainIssue: string;
  result: BreakdownResult;
}) {
  const { sport, motion, ageGroup, skillLevel, mainIssue, result } = params;
  const cueLines = result.cues.map((cue) => `- ${cue}`).join("\n");

  return [
    "Coaching Breakdown",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "SESSION",
    `Sport: ${formatLabel(sport)}`,
    `Motion: ${formatLabel(motion)}`,
    `Age group: ${cleanText(ageGroup) || "Not provided"}`,
    `Skill level: ${cleanText(skillLevel) || "Not provided"}`,
    "",
    "MAIN ISSUE",
    cleanText(mainIssue),
    "",
    "MECHANICS",
    result.mechanics,
    "",
    "TIMING",
    result.timing,
    "",
    "COACHING CUES",
    cueLines,
    "",
    "NEXT FOCUS",
    result.nextFocus,
    "",
    "RECOMMENDED DRILL",
    result.drill,
  ].join("\n");
}
