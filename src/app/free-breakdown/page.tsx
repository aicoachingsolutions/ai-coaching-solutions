"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type Sport = "baseball" | "softball" | "golf";
type Motion = "swing" | "pitching";

type BreakdownResult = {
  mechanics: string;
  timing: string;
  cues: string[];
  nextFocus: string;
  drill: string;
};

const outcomeCards = [
  {
    title: "Mechanics analysis",
    text: "Identify likely movement inefficiencies tied to your miss pattern.",
  },
  {
    title: "Timing checkpoints",
    text: "Get practical sequence notes to improve consistency and contact quality.",
  },
  {
    title: "Actionable drill",
    text: "Leave with one clear drill and a specific next focus for practice.",
  },
];

const formTips = [
  "Mention handedness and where misses show up most often.",
  "Describe contact quality or ball flight in game terms.",
  "Share one objective outcome you want from practice.",
];

function cleanText(s: string) {
  return (s || "").trim();
}

function formatLabel(value: string) {
  if (!value) return "Not provided";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildBreakdownText(params: {
  sport: Sport;
  motion: Motion;
  ageGroup: string;
  skillLevel: string;
  videoLink: string;
  mainIssue: string;
  result: BreakdownResult;
}) {
  const { sport, motion, ageGroup, skillLevel, videoLink, mainIssue, result } = params;
  const cueLines = result.cues.map((cue) => `- ${cue}`).join("\n");

  return [
    "AI Coaching Breakdown",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "SESSION",
    `Sport: ${formatLabel(sport)}`,
    `Motion: ${formatLabel(motion)}`,
    `Age group: ${cleanText(ageGroup) || "Not provided"}`,
    `Skill level: ${cleanText(skillLevel) || "Not provided"}`,
    `Video link: ${cleanText(videoLink) || "Not provided"}`,
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

export default function FreeBreakdownPage() {
  const [sport, setSport] = useState<Sport>("baseball");
  const [motion, setMotion] = useState<Motion>("swing");

  const [videoLink, setVideoLink] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [mainIssue, setMainIssue] = useState("");

  const [result, setResult] = useState<BreakdownResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "error">("idle");
  const [email, setEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    // keep this aligned with your API min length
    return (
      cleanText(mainIssue).length >= 20 &&
      cleanText(ageGroup).length > 0 &&
      !loading
    );
  }, [mainIssue, ageGroup, loading]);
  const mainIssueLength = cleanText(mainIssue).length;
  const inputClassName =
    "box-border w-full max-w-full rounded-xl border-2 border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50";
  const selectClassName =
    "box-border w-full max-w-full rounded-xl border-2 border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 appearance-auto";
  const textareaClassName =
    "box-border w-full max-w-full rounded-xl border-2 border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          videoLink: cleanText(videoLink), // optional context only
          ageGroup: cleanText(ageGroup),
          skillLevel: cleanText(skillLevel),
          mainIssue: cleanText(mainIssue),
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          json?.error ||
          json?.message ||
          (json?.details?.formErrors?.[0] as string | undefined) ||
          `Request failed (${res.status})`;
        throw new Error(msg);
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

      setResult(r);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResults = async () => {
    if (!result) return;
    const copyText = buildBreakdownText({
      sport,
      motion,
      ageGroup,
      skillLevel,
      videoLink,
      mainIssue,
      result,
    });

    try {
      await navigator.clipboard.writeText(copyText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
    }
  };

  const downloadBreakdownPdf = () => {
    if (!result) return;
    setPdfState("loading");
    try {
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 48;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;
      let y = 56;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("AI Coaching Breakdown", margin, y);
      y += 20;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
      y += 18;

      const lines = doc.splitTextToSize(
        buildBreakdownText({
          sport,
          motion,
          ageGroup,
          skillLevel,
          videoLink,
          mainIssue,
          result,
        }),
        maxWidth
      );

      doc.setFontSize(11);
      lines.forEach((line: string) => {
        if (y > 760) {
          doc.addPage();
          y = 56;
        }
        doc.text(line, margin, y);
        y += 14;
      });

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

    if (!cleanText(email) || !cleanText(email).includes("@")) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailSending(true);
    try {
      const res = await fetch("/api/breakdown/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanText(email),
          source: "free-breakdown",
          sport,
          motion,
          ageGroup: cleanText(ageGroup),
          skillLevel: cleanText(skillLevel),
          videoLink: cleanText(videoLink),
          mainIssue: cleanText(mainIssue),
          result,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to send email");
      }

      setEmailSent(true);
      setEmailError(null);
    } catch (err: any) {
      setEmailError(err?.message || "Failed to send email");
      setEmailSent(false);
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="relative overflow-x-hidden overflow-y-hidden">
      <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-56 h-72 w-72 translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <header className="relative overflow-x-hidden overflow-y-hidden rounded-2xl bg-white shadow-md">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1000px 320px at 0% 0%, rgba(255,255,255,0.20), transparent 48%), radial-gradient(800px 260px at 100% 0%, rgba(191,219,254,0.26), transparent 45%), linear-gradient(130deg, rgba(11,31,58,1) 0%, rgba(16,48,85,0.98) 52%, rgba(10,37,73,0.94) 100%)",
            }}
          />
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Free Coaching Resource
              </div>
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                Estimated time: &lt;60 seconds
              </div>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Free Swing & Pitching Breakdown
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-white/90 sm:text-base">Structured, practice-ready feedback built by a coach. Share what you’re seeing and get mechanics notes, coaching cues, next focus, and a drill you can run next practice.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {outcomeCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/25 bg-white/12 p-4 backdrop-blur-[1px]"
                >
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/90">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs text-white/90">
              Video links are optional context and may not always be viewable.
              The quality of your written details drives the quality of your
              breakdown.
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="card card-pad shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="h2">Tell us what you are seeing</h2>
                  <p className="muted mt-1">
                    The more specific your context, the sharper the feedback.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border bg-neutral-50/80 p-4">
                <p className="kicker">Session setup</p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="label">Sport</label>
                    <select
                      value={sport}
                      onChange={(e) => setSport(e.target.value as Sport)}
                      className={selectClassName}
                    >
                      <option value="baseball">Baseball</option>
                      <option value="softball">Softball</option>
                      <option value="golf">Golf</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="label">Motion</label>
                    <select
                      value={motion}
                      onChange={(e) => setMotion(e.target.value as Motion)}
                      className={selectClassName}
                    >
                      <option value="swing">Swing / Hitting</option>
                      <option value="pitching">Pitching</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="label">Clip link (optional)</label>
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className={inputClassName}
                  placeholder="Optional - link for reference only"
                />
                <p className="muted">
                  We do not store your video. Some links may be inaccessible.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="label">Age group (required)</label>
                  <input
                    type="text"
                    required
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className={inputClassName}
                    placeholder="Example: 12U, high school, college"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label">Skill level (optional)</label>
                  <input
                    type="text"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className={inputClassName}
                    placeholder="Beginner, intermediate, advanced"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="label">What are you seeing? (required)</label>
                  <span
                    className={`text-xs ${mainIssueLength >= 20 ? "text-emerald-700" : "text-neutral-500"}`}
                  >
                    {mainIssueLength}/20 minimum
                  </span>
                </div>
                <textarea
                  required
                  value={mainIssue}
                  onChange={(e) => setMainIssue(e.target.value)}
                  className={textareaClassName}
                  rows={6}
                  placeholder="Example: Right-handed hitter rolling over ground balls to 3B, front shoulder opening early, and late to inside velocity. Goal: more line-drive contact to pull side."
                />
                <p className="muted">
                  Include handedness, miss pattern, and what good looks like.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="mt-1 rounded-2xl border-2 border-orange-200 bg-orange-50/60 p-4 shadow-sm md:p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-6 py-4 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                >
                  {loading ? "Generating..." : "Generate breakdown"}
                </button>
                <p className="text-xs font-medium text-neutral-800">
                  Coaching-first output, based on your inputs.
                </p>
                </div>
              </div>
            </form>
          </div>

          <aside className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            <div className="rounded-xl border bg-neutral-50 p-4">
              <p className="kicker">Best results</p>
              <h3 className="mt-2 text-base font-semibold text-neutral-900">
                Describe it in game-realistic terms
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-left">
                {formTips.map((tip) => (
                  <li key={tip} className="text-sm text-neutral-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border bg-neutral-50 p-4">
              <p className="kicker">What this is</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                A fast starting point for practice planning and athlete
                communication.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                Use this alongside in-person coaching and video review workflow.
              </p>
            </div>
          </aside>
        </section>

        {result && (
          <section className="mt-10 card card-pad shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Breakdown
                </h2>
                <p className="muted mt-1">
                  Use this as a coaching draft. Confirm adjustments in person and calibrate to the athlete.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-neutral-200" />

            <div className="mt-8 space-y-10">
              <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Mechanics
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
                    {result.mechanics}
                  </p>
                </article>

                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Timing
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
                    {result.timing}
                  </p>
                </article>
              </div>

              <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Coaching Cues
                </p>
                <ul className="mt-3 space-y-1.5">
                  {result.cues.map((cue, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900"
                    >
                      {cue}
                    </li>
                  ))}
                </ul>
              </article>

              <div className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Next Focus
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
                    {result.nextFocus}
                  </p>
                </article>

                <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Recommended Drill
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
                    {result.drill}
                  </p>
                </article>
              </div>

            </div>

            <section className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
              <h3 className="text-base font-semibold text-neutral-900">
                Want the full tool inside the app?
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-800">
                <li>Upload a clip (paid tools)</li>
                <li>More drill options + progressions</li>
                <li>Athlete-friendly version + coach notes</li>
                <li>Save and revisit breakdown history (coming soon)</li>
              </ul>
              <p className="mt-4 text-xs text-neutral-600">
                Free breakdown stays link-based. Paid tools live inside the AI Coaching Solutions app.
              </p>
              <div className="mt-4">
                <a
                  href="/tools"
                  className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
                >
                  See the Tools App
                </a>
              </div>
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCopyResults}
                className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700"
              >
                Copy breakdown
              </button>
              <button
                type="button"
                onClick={downloadBreakdownPdf}
                disabled={pdfState === "loading"}
                className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-60"
              >
                {pdfState === "loading" ? "Preparing PDF..." : "Download PDF"}
              </button>
            </div>
            {copyState === "copied" && (
              <p className="mt-2 text-xs text-emerald-700">Copied ✅</p>
            )}
            {copyState === "error" && (
              <p className="mt-2 text-xs text-red-700">Copy failed. Please try again.</p>
            )}
            {pdfState === "error" && (
              <p className="mt-2 text-xs text-red-700">PDF download failed. Please try again.</p>
            )}

            <div className="mt-10 border-t pt-6">
              <p className="text-sm font-medium">
                Optional: Email this breakdown to yourself + get occasional coach notes (no spam).
              </p>
              <form className="mt-4 flex flex-col gap-3 md:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(null);
                    setEmailSent(false);
                  }}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200"
                />
                <button
                  type="button"
                  onClick={handleEmailBreakdown}
                  disabled={emailSending}
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {emailSending ? "Sending..." : emailSent ? "Sent ✅" : "Email me this breakdown"}
                </button>
              </form>
              {emailError && <p className="mt-2 text-xs text-red-700">{emailError}</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}