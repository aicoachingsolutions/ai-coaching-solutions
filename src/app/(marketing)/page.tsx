import Link from "next/link";
import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";

const break90SignupUrl =
  process.env.NEXT_PUBLIC_BREAK90_URL?.trim() || "https://break90.app";

const practicePlannerEntryUrl =
  process.env.NEXT_PUBLIC_PRACTICE_PLANNER_ENTRY_URL?.trim() || "/app/practice-planner";

const tools = [
  {
    badge: "FREE — No Login",
    badgeStyle: "bg-[#ffd60a] text-[#0b1f3a]",
    cardStyle: "border-2 border-[#ffd60a]",
    title: "Free Swing Analyzer",
    sport: "Baseball · Softball · Golf",
    description:
      "Describe what you're seeing and get a full coaching breakdown in under 60 seconds. Mechanics, timing, cues, a drill, and one clear next focus.",
    bullets: [
      "Works for swing and pitching",
      "Results you can copy, download, or email",
      "No account needed",
    ],
    cta: "free-breakdown",
    ctaLabel: "Try Free Swing Analyzer",
    ctaStyle:
      "bg-[#ffd60a] text-[#0b1f3a] hover:bg-[#ffe566] font-bold",
    external: false,
  },
  {
    badge: "30 Days Free",
    badgeStyle: "bg-[#0b1f3a] text-white",
    cardStyle: "border border-neutral-200",
    title: "Practice Planner",
    sport: "Baseball · Softball",
    description:
      "Build structured, efficient practice sessions in minutes. Organize your drills, build plans, and run practice with a real system behind it.",
    bullets: [
      "Drill library built in",
      "Build offensive, defensive, or full practices",
      "Save and reuse what works",
    ],
    cta: practicePlannerEntryUrl,
    ctaLabel: "Try Practice Planner Free",
    ctaStyle: "bg-[#0b1f3a] text-white hover:bg-[#071426] font-semibold",
    external: practicePlannerEntryUrl.startsWith("http"),
  },
  {
    badge: "90 Days Free",
    badgeStyle: "bg-[#0b1f3a] text-white",
    cardStyle: "border border-neutral-200",
    title: "Break90 Golf",
    sport: "Golf",
    description:
      "Track your rounds, find what's actually costing you strokes, and get clear practice priorities after every round — not generic stats.",
    bullets: [
      "Round tracking and pattern analysis",
      "Clear practice focus after every round",
      "Built for real golfers",
    ],
    cta: break90SignupUrl,
    ctaLabel: "Try Break90 Free",
    ctaStyle: "bg-[#0b1f3a] text-white hover:bg-[#071426] font-semibold",
    external: true,
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#f8f8fc]">
      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-14 text-center sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ffd60a]">
          AI Coaching Solutions
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
          AI Tools Built for Coaches
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
          Practical tools for baseball, softball, and golf coaches. Get structured breakdowns,
          smarter practice plans, and clear next steps — fast.
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-white/55">
          <span>No fluff</span>
          <span>·</span>
          <span>Built by a coach</span>
          <span>·</span>
          <span>Free to start</span>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className={`flex flex-col rounded-2xl bg-white p-6 shadow-sm ${tool.cardStyle}`}
            >
              <span
                className={`self-start rounded-full px-3 py-1 text-xs font-bold ${tool.badgeStyle}`}
              >
                {tool.badge}
              </span>

              <h2 className="mt-4 text-xl font-bold text-[#0b1f3a]">{tool.title}</h2>
              <p className="mt-0.5 text-xs font-medium text-[#94a3b8]">{tool.sport}</p>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
                {tool.description}
              </p>

              <ul className="mt-4 space-y-1.5">
                {tool.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="mt-0.5 text-[#ffd60a] font-bold">✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              {tool.title === "Free Swing Analyzer" ? (
                <FreeBreakdownTrackedLink
                  location="home_card"
                  className={`mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm transition ${tool.ctaStyle}`}
                >
                  {tool.ctaLabel}
                </FreeBreakdownTrackedLink>
              ) : (
                <Link
                  href={tool.cta}
                  {...(tool.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm transition ${tool.ctaStyle}`}
                >
                  {tool.ctaLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom trust bar */}
      <div className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
            <p className="text-sm text-neutral-500">
              Built by a coach for coaches. Designed for practical, immediate use.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/howitworks" className="text-[#0b1f3a] font-medium hover:underline">
                How It Works
              </Link>
              <Link href="/contact" className="text-[#0b1f3a] font-medium hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
