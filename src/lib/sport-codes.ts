/** Fixed sport list for team creation (MVP). Display labels only — same structure for every sport. */
export const SPORT_OPTIONS = [
  { code: "BASKETBALL", label: "Basketball" },
  { code: "SOCCER", label: "Soccer" },
  { code: "VOLLEYBALL", label: "Volleyball" },
  { code: "BASEBALL", label: "Baseball" },
  { code: "SOFTBALL", label: "Softball" },
  { code: "FOOTBALL", label: "Football" },
  { code: "LACROSSE", label: "Lacrosse" },
  { code: "HOCKEY", label: "Hockey" },
  { code: "OTHER", label: "Other" },
] as const;

export type SportCode = (typeof SPORT_OPTIONS)[number]["code"];

export function isSportCode(value: string): value is SportCode {
  return SPORT_OPTIONS.some((o) => o.code === value);
}

export function sportLabel(code: string): string {
  const found = SPORT_OPTIONS.find((o) => o.code === code);
  return found?.label ?? code;
}
