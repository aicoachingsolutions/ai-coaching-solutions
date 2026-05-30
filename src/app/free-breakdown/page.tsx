"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { track } from "@vercel/analytics";

type Sport = "baseball" | "softball" | "golf";
type Motion = "swing" | "pitching";
type Handedness = "right" | "left";

type BreakdownResult = {
  mechanics: string;
  timing: string;
  cues: string[];
  nextFocus: string;
  drill: string;
};

const AGE_GROUPS = [
  "Youth (8U–10U)",
  "Youth (11U–12U)",
  "Middle School (13U–14U)",
  "High School (15–18)",
  "College",
  "Adult (Recreational)",
  "Adult (Competitive)",
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Competitive"] as const;

const SPORTS: { value: Sport; label: string }[] = [
  { value: "baseball", label: "Baseball" },
  { value: "softball", label: "Softball" },
  { value: "golf", label: "Golf" },
];

const PLACEHOLDERS: Record<Sport, Partial<Record<Motion, string>>> = {
  baseball: {
    swing:
      "Example: Right-handed hitter, High School. Rolling over on inside fastballs — weak grounders to third. Front shoulder flying open early, late to inside velocity. Want to drive the ball to the pull side with authority.",
    pitching:
      "Example: Right-handed pitcher, Middle School. Fastball consistently up in the zone. Rushing from the stretch, front foot landing early. Want to locate down in the zone and add deception.",
  },
  softball: {
    swing:
      "Example: Right-handed hitter, 12U travel ball. Topping the ball for weak grounders to the right side. Dropping the back shoulder and swinging up. Want consistent hard contact up the middle.",
    pitching:
      "Example: Right-handed pitcher, High School JV. Losing command of the rise ball, rotating off to the glove side. Want to stay closed longer and repeat the delivery.",
  },
  golf: {
    swing:
      "Example: Right-handed golfer, Adult Recreational, 95–100 average. Coming over the top — pulling drives left and hitting weak slices with irons. Want to get the club on plane and hit the ball straighter.",
  },
};

function cleanText(s: string) {
  return (s || "").trim();
}

function cap(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildBreakdownText(params: {
  sport: Sport;
  motion: Motion;
  handedness: Handedness;
  ageGroup: string;
  skillLevel: string;
  mainIssue: string;
  result: BreakdownResult;
}) {
  const { sport, motion, handedness, ageGroup, skillLevel, mainIssue, result } = params;
  const cueLines = result.cues.map((c) => `  • ${c}`).join("\n");
  const sessionLines = [
    `Sport:        ${cap(sport)}`,
    `Motion:       ${cap(motion)}`,
    sport !== "golf" ? `Handedness:   ${cap(handedness)}-handed` : null,
    ageGroup ? `Age group:    ${ageGroup}` : null,
    skillLevel ? `Skill level:  ${skillLevel}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "════════════════════════════════════",
    "  COACHING BREAKDOWN",
    `  ${new Date().toLocaleString()}`,
    "════════════════════════════════════",
    "",
    "SESSION",
    sessionLines,
    "",
    "ISSUE DESCRIBED",
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
    "",
    "════════════════════════════════════",
    "  AI Coaching Solutions",
    "  aicoachingsolutions.net",
    "════════════════════════════════════",
  ].join("\n");
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl border-2 py-3 text-base font-semibold transition-all ${
        active
          ? "border-[#0b1f3a] bg-[#0b1f3a] text-white shadow-sm"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-[#0b1f3a]/40 hover:text-[#0b1f3a]"
      }`}
    >
      {children}
    </button>
  );
}

const SECTION_LABEL = "text-xs font-bold uppercase tracking-widest";

export default function FreeBreakdownPage() {
  const [sport, setSport] = useState<Sport>("baseball");
  const [motion, setMotion] = useState<Motion>("swing");
  const [handedness, setHandedness] = useState<Handedness>("right");
  const [ageGroup, setAgeGroup] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [mainIssue, setMainIssue] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [result, setResult] = useState<BreakdownResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "error">("idle");
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const intakeStartedRef = useRef(false);
  const resultsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sport === "golf") setMotion("swing");
  }, [sport]);

  useEffect(() => {
    if (!result) return;
    track("Swing Breakdown Result Viewed", { tool: "free_swing_breakdown" });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = resultsSectionRef.current;
        if (!el) return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });
  }, [result]);

  const mainIssueLength = cleanText(mainIssue).length;

  const canSubmit = useMemo(
    () =>
      mainIssueLength >= 20 &&
      mainIssueLength <= 600 &&
      ageGroup !== "" &&
      !loading &&
      honeypot === "",
    [mainIssueLength, ageGroup, loading, honeypot]
  );

  const placeholder = PLACEHOLDERS[sport]?.[motion] ?? PLACEHOLDERS[sport]["swing"] ?? "";

  const breakdownParams = { sport, motion, handedness, ageGroup, skillLevel, mainIssue };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setResult(null);
    setCopyState("idle");
    setPdfState("idle");
    setEmailSent(false);
    setEmailError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          motion,
          handedness: sport !== "golf" ? handedness : undefined,
          ageGroup: cleanText(ageGroup),
          skillLevel: cleanText(skillLevel),
          mainIssue: cleanText(mainIssue),
          _hp: honeypot,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          json?.error ||
            json?.message ||
            (json?.details?.formErrors?.[0] as string | undefined) ||
            `Request failed (${res.status})`
        );
      }

      const r = json?.result as BreakdownResult | undefined;
      if (
        !r ||
        typeof r.mechanics !== "string" ||
        typeof r.timing !== "string" ||
        !Array.isArray(r.cues) ||
        typeof r.nextFocus !== "string" ||
        typeof r.drill !== "string"
      ) {
        throw new Error("Unexpected response format. Please try again.");
      }

      track("Swing Analysis Submitted", { tool: "free_swing_breakdown" });
      setResult(r);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResults = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildBreakdownText({ ...breakdownParams, result }));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
    }
  };

  const downloadBreakdownPdf = () => {
    if (!result) return;
    setPdfState("loading");
    try {
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 52;
      const maxWidth = pageWidth - margin * 2;
      let y = 0;

      // Navy header bar
      doc.setFillColor(11, 31, 58);
      doc.rect(0, 0, pageWidth, 44, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 214, 10);
      doc.text("AI Coaching Solutions", margin, 28);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("Free Swing & Pitching Breakdown", pageWidth - margin, 28, { align: "right" });

      // Gold accent line
      doc.setFillColor(255, 214, 10);
      doc.rect(0, 44, pageWidth, 2, "F");

      y = 72;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(11, 31, 58);
      doc.text("Coaching Breakdown", margin, y);
      y += 18;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      y += 28;

      const SECTION_HEADERS = new Set([
        "SESSION",
        "ISSUE DESCRIBED",
        "MECHANICS",
        "TIMING",
        "COACHING CUES",
        "NEXT FOCUS",
        "RECOMMENDED DRILL",
      ]);

      const rawText = buildBreakdownText({ ...breakdownParams, result });
      const cleanedLines = rawText
        .split("\n")
        .filter((l) => !l.startsWith("════") && !l.trim().startsWith("Coaching Breakdown") && !l.trim().startsWith("aicoaching"));

      cleanedLines.forEach((line) => {
        if (y > 750) {
          doc.addPage();
          y = 52;
        }

        const trimmed = line.trim();

        if (SECTION_HEADERS.has(trimmed)) {
          y += 6;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(11, 31, 58);
          doc.text(trimmed, margin, y);
          // Underline
          doc.setDrawColor(255, 214, 10);
          doc.setLineWidth(1);
          doc.line(margin, y + 2, margin + 60, y + 2);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          y += 14;
        } else if (trimmed === "") {
          y += 6;
        } else {
          const wrapped = doc.splitTextToSize(line, maxWidth);
          wrapped.forEach((wl: string) => {
            if (y > 750) {
              doc.addPage();
              y = 52;
            }
            doc.text(wl, margin, y);
            y += 14;
          });
        }
      });

      // Footer on last page
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        "This is a coaching draft. Confirm adjustments with the athlete in person.",
        margin,
        doc.internal.pageSize.getHeight() - 24
      );

      doc.save("coaching-breakdown.pdf");
      setPdfState("idle");
    } catch {
      setPdfState("error");
    }
  };

  const handleEmailBreakdown = async () => {
    if (!result) return;
    setEmailError(null);
    setEmailSent(false);

    const trimmedEmail = cleanText(email);
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailSending(true);
    try {
      const res = await fetch("/api/breakdown/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          source: "free-breakdown",
          sport,
          motion,
          ageGroup: cleanText(ageGroup),
          skillLevel: cleanText(skillLevel),
          mainIssue: cleanText(mainIssue),
          result,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Failed to send email");
      setEmailSent(true);
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  const contextLabel = [
    cap(sport),
    cap(motion),
    sport !== "golf" ? `${cap(handedness)}-handed` : null,
    ageGroup || null,
    skillLevel || null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  const charCountColor =
    mainIssueLength === 0
      ? "text-neutral-400"
      : mainIssueLength < 20
        ? "text-red-500"
        : mainIssueLength > 550
          ? "text-amber-500"
          : "text-emerald-600";

  return (
    <div className="bg-[#f8f8fc]">
      {/* Page header */}
      <div className="bg-[#0b1f3a] px-4 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd60a]/30 bg-[#ffd60a]/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ffd60a]" />
            <span className="text-sm font-bold uppercase tracking-widest text-[#ffd60a]">
              Free — No Login Required
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Free Swing &amp; Pitching Breakdown
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Describe what you&apos;re seeing. Get mechanics notes, coaching cues, a drill, and one
            clear next focus — in under 60 seconds.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Mechanics read", desc: "Root cause + downstream effects on movement" },
              { label: "Coaching cues", desc: "Short, vivid language to use during live reps" },
              { label: "Ready-to-run drill", desc: "Setup, reps, and one coaching point" },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-white/10 bg-white/[0.07] p-4 text-left"
              >
                <p className="text-sm font-bold text-[#ffd60a]">{c.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form + sidebar */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Form card */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-0">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Step 1 */}
              <div className="border-b border-neutral-100 p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0b1f3a] text-base font-bold text-[#ffd60a]">
                    1
                  </span>
                  <h2 className="text-xl font-bold text-[#0b1f3a]">What are we analyzing?</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={`mb-3 block ${SECTION_LABEL} text-neutral-500`}>Sport</label>
                    <div className="flex gap-2">
                      {SPORTS.map(({ value, label }) => (
                        <ToggleButton
                          key={value}
                          active={sport === value}
                          onClick={() => setSport(value)}
                        >
                          {label}
                        </ToggleButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`mb-3 block ${SECTION_LABEL} text-neutral-500`}>Motion</label>
                    <div className="flex gap-2">
                      <ToggleButton
                        active={motion === "swing"}
                        onClick={() => setMotion("swing")}
                      >
                        Swing / Hitting
                      </ToggleButton>
                      {sport !== "golf" && (
                        <ToggleButton
                          active={motion === "pitching"}
                          onClick={() => setMotion("pitching")}
                        >
                          Pitching
                        </ToggleButton>
                      )}
                    </div>
                  </div>

                  {sport !== "golf" && (
                    <div>
                      <label className={`mb-3 block ${SECTION_LABEL} text-neutral-500`}>
                        Handedness
                      </label>
                      <div className="flex gap-2">
                        <ToggleButton
                          active={handedness === "right"}
                          onClick={() => setHandedness("right")}
                        >
                          Right-Handed
                        </ToggleButton>
                        <ToggleButton
                          active={handedness === "left"}
                          onClick={() => setHandedness("left")}
                        >
                          Left-Handed
                        </ToggleButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className="border-b border-neutral-100 p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0b1f3a] text-base font-bold text-[#ffd60a]">
                    2
                  </span>
                  <h2 className="text-xl font-bold text-[#0b1f3a]">About the athlete</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={`mb-3 block ${SECTION_LABEL} text-neutral-500`}>
                      Age group{" "}
                      <span className="normal-case font-normal text-red-400">(required)</span>
                    </label>
                    <select
                      value={ageGroup}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      required
                      className="box-border w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3.5 text-base text-neutral-900 outline-none transition focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 appearance-auto"
                    >
                      <option value="">Select age group...</option>
                      {AGE_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`mb-3 block ${SECTION_LABEL} text-neutral-500`}>
                      Skill level{" "}
                      <span className="normal-case font-normal text-neutral-400">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_LEVELS.map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setSkillLevel(skillLevel === level ? "" : level)}
                          className={`rounded-full border-2 px-5 py-2 text-base font-medium transition-all ${
                            skillLevel === level
                              ? "border-[#0b1f3a] bg-[#0b1f3a] text-white shadow-sm"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-[#0b1f3a]/40 hover:text-[#0b1f3a]"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0b1f3a] text-base font-bold text-[#ffd60a]">
                    3
                  </span>
                  <h2 className="text-xl font-bold text-[#0b1f3a]">What are you seeing?</h2>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-neutral-500">
                    More detail = sharper feedback
                  </p>
                  <span className={`text-sm font-semibold tabular-nums ${charCountColor}`}>
                    {mainIssueLength} / 600
                  </span>
                </div>

                <textarea
                  required
                  value={mainIssue}
                  maxLength={600}
                  onChange={(e) => setMainIssue(e.target.value)}
                  onFocus={() => {
                    if (intakeStartedRef.current) return;
                    intakeStartedRef.current = true;
                    track("Swing Upload Started", { tool: "free_swing_breakdown" });
                  }}
                  className="box-border w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3.5 text-base leading-relaxed text-neutral-900 outline-none transition focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10"
                  rows={6}
                  placeholder={placeholder}
                />
                <p className="mt-3 text-sm text-neutral-500">
                  Include miss pattern, contact quality or ball flight, and what you want to improve.
                </p>

                {/* Error */}
                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffd60a] px-6 py-5 text-lg font-bold text-[#0b1f3a] shadow-sm transition hover:bg-[#ffe566] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0b1f3a]/20 border-t-[#0b1f3a]" />
                        Analyzing your breakdown...
                      </>
                    ) : (
                      "Get My Coaching Breakdown →"
                    )}
                  </button>
                  {loading && (
                    <p className="mt-3 text-center text-sm text-neutral-500">
                      This usually takes 15–30 seconds
                    </p>
                  )}
                  {!loading && !canSubmit && mainIssueLength > 0 && mainIssueLength < 20 && (
                    <p className="mt-3 text-center text-sm text-red-500">
                      {20 - mainIssueLength} more characters needed
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            {/* Best results — gold themed tip card */}
            <div className="overflow-hidden rounded-2xl border-2 border-[#ffd60a] bg-gradient-to-br from-[#fffbe6] to-[#fff4b8] shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd60a] text-base">
                    💡
                  </span>
                  <p className={`${SECTION_LABEL} text-[#0b1f3a]`}>Best Results</p>
                </div>
                <p className="mt-3 text-base font-bold text-[#0b1f3a]">
                  Describe it in game-realistic terms
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Handedness and where misses show up most",
                    "Contact quality or ball flight in game terms",
                    "One clear outcome you want from practice",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2.5 text-base leading-relaxed text-[#0b1f3a]/85"
                    >
                      <span className="mt-0.5 flex-shrink-0 font-bold text-[#0b1f3a]">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What you get — navy themed promo card */}
            <div className="overflow-hidden rounded-2xl bg-[#0b1f3a] shadow-md">
              <div className="h-1.5 bg-[#ffd60a]" />
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd60a] text-base">
                    🏆
                  </span>
                  <p className={`${SECTION_LABEL} text-[#ffd60a]`}>What You Get</p>
                </div>
                <p className="mt-3 text-base font-bold text-white">
                  Coach-ready breakdown in under 60 sec
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Mechanics read with root cause",
                    "Timing and sequence notes",
                    "Cues to say during live reps",
                    "One priority and one drill",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-base leading-relaxed text-white/85"
                    >
                      <span className="mt-0.5 flex-shrink-0 font-bold text-[#ffd60a]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety disclaimer */}
            <div className="overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-base">
                  ⚠️
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-amber-900">
                    Safety Notice
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-amber-900/90">
                    Drill suggestions are coaching drafts, not medical advice. Always warm up
                    properly, ensure adult supervision for youth athletes, and stop immediately if
                    any pain or discomfort occurs. AI Coaching Solutions is not responsible for
                    injury resulting from the use of these suggestions.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Results */}
        {result && (
          <section
            ref={resultsSectionRef}
            className="mt-8 scroll-mt-4 space-y-4"
            aria-label="Your breakdown results"
          >
            {/* Results header with actions */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="h-1.5 bg-[#0b1f3a]" />
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1f3a] sm:text-3xl">Your Coaching Breakdown</h2>
                  <p className="mt-2 text-sm text-neutral-500">{contextLabel}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyResults}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-neutral-200 bg-white px-5 py-2.5 text-base font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:border-neutral-300"
                  >
                    {copyState === "copied" ? "✓ Copied" : "Copy Text"}
                  </button>
                  <button
                    type="button"
                    onClick={downloadBreakdownPdf}
                    disabled={pdfState === "loading"}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-neutral-200 bg-white px-5 py-2.5 text-base font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-50"
                  >
                    {pdfState === "loading" ? "Preparing…" : "Download PDF"}
                  </button>
                </div>
              </div>
              {(copyState === "error" || pdfState === "error") && (
                <p className="px-6 pb-4 text-sm text-red-600">
                  {copyState === "error" ? "Copy failed." : "PDF failed."} Please try again.
                </p>
              )}
            </div>

            {/* Mechanics + Timing */}
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="h-2 bg-[#0b1f3a]" />
                <div className="p-7 sm:p-8">
                  <p className={`${SECTION_LABEL} text-[#0b1f3a]`}>Mechanics</p>
                  <p className="mt-4 text-base leading-relaxed text-neutral-800 sm:text-lg">
                    {result.mechanics}
                  </p>
                </div>
              </article>

              <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="h-2 bg-[#0b1f3a]" />
                <div className="p-7 sm:p-8">
                  <p className={`${SECTION_LABEL} text-[#0b1f3a]`}>Timing</p>
                  <p className="mt-4 text-base leading-relaxed text-neutral-800 sm:text-lg">
                    {result.timing}
                  </p>
                </div>
              </article>
            </div>

            {/* Coaching Cues */}
            <article className="overflow-hidden rounded-2xl border border-[#ffd60a]/40 shadow-sm">
              <div className="h-2 bg-[#ffd60a]" />
              <div className="bg-[#ffd60a]/[0.05] p-7 sm:p-8">
                <p className={`${SECTION_LABEL} text-[#0b1f3a]`}>Coaching Cues</p>
                <p className="mt-1 text-sm text-neutral-500">Say these during live reps</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {result.cues.map((cue, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full border-2 border-[#0b1f3a]/15 bg-white px-5 py-2.5 text-base font-medium text-[#0b1f3a] shadow-sm"
                    >
                      {cue}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Next Focus + Drill */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Next Focus — gold accented, highest priority */}
              <article className="overflow-hidden rounded-2xl border-2 border-[#ffd60a] bg-white shadow-sm">
                <div className="h-2 bg-[#ffd60a]" />
                <div className="p-7 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#ffd60a] px-3 py-1 text-xs font-bold text-[#0b1f3a]">
                      TOP PRIORITY
                    </span>
                  </div>
                  <p className={`mt-4 ${SECTION_LABEL} text-[#0b1f3a]`}>Next Focus</p>
                  <p className="mt-3 text-base font-medium leading-relaxed text-neutral-900 sm:text-lg">
                    {result.nextFocus}
                  </p>
                </div>
              </article>

              {/* Recommended Drill — navy, final action */}
              <article className="overflow-hidden rounded-2xl bg-[#0b1f3a] shadow-md">
                <div className="h-2 bg-[#ffd60a]" />
                <div className="p-7 sm:p-8">
                  <p className={`${SECTION_LABEL} text-[#ffd60a]`}>Recommended Drill</p>
                  <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">{result.drill}</p>
                </div>
              </article>
            </div>

            {/* Safety disclaimer — prominent placement after drill */}
            <div className="overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-50 shadow-sm">
              <div className="flex items-start gap-4 p-6 sm:p-7">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-xl">
                  ⚠️
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold uppercase tracking-wider text-amber-900">
                    Before Running This Drill
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-amber-900/90">
                    These suggestions are coaching drafts, not medical or professional training
                    advice. Always:
                  </p>
                  <ul className="mt-3 space-y-1.5 text-base text-amber-900/90">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0 font-bold">•</span>
                      Warm up properly before any drill work
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0 font-bold">•</span>
                      Ensure qualified adult supervision for all youth athletes
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0 font-bold">•</span>
                      Stop immediately if any pain, dizziness, or discomfort occurs
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0 font-bold">•</span>
                      Consult a qualified coach, trainer, or medical professional before
                      introducing new movements
                    </li>
                  </ul>
                  <p className="mt-3 text-sm leading-relaxed text-amber-900/75">
                    AI Coaching Solutions and its tools are not liable for any injury, harm, or
                    adverse outcome resulting from the use of these suggestions. Use at your own
                    discretion.
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-lg font-semibold text-neutral-900">
                Email this breakdown to yourself
              </p>
              <p className="mt-1.5 text-sm text-neutral-500">
                Optional — get occasional coach notes too. No spam.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(null);
                    setEmailSent(false);
                  }}
                  placeholder="you@example.com"
                  className="box-border w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3.5 text-base text-neutral-900 outline-none transition focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10"
                />
                <button
                  type="button"
                  onClick={handleEmailBreakdown}
                  disabled={emailSending || emailSent}
                  className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-[#0b1f3a] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#071426] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {emailSending ? "Sending…" : emailSent ? "Sent ✓" : "Email me this"}
                </button>
              </div>
              {emailError && <p className="mt-3 text-sm text-red-600">{emailError}</p>}
            </div>

            {/* Upsell */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 sm:p-8">
              <p className="text-lg font-semibold text-neutral-900">
                Want to save drills and build practice plans?
              </p>
              <p className="mt-1.5 text-sm text-neutral-500">
                The coach app is where plans, drill libraries, and team profiles live.
              </p>
              <Link
                href="/sign-up"
                onClick={() =>
                  track("Upgrade Clicked", { source: "free_swing_breakdown_results" })
                }
                className="mt-5 inline-flex items-center justify-center rounded-lg border-2 border-neutral-300 bg-white px-5 py-3 text-base font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Create a free coach account
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
