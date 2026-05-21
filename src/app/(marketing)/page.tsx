import Image from "next/image";
import Link from "next/link";
import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";

const marketingSiteUrl =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL?.trim() || "https://aicoachingsolutions.com";

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-5 py-3.5 text-sm font-semibold text-[#071426] transition hover:-translate-y-px hover:bg-[#ffe566] hover:border-[#ffe566]";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-white/35 bg-transparent px-5 py-3.5 text-sm font-semibold text-[#f8fafc] transition hover:-translate-y-px hover:border-white hover:bg-white/[0.06]";
const btnComingSoon =
  "inline-flex items-center justify-center rounded-xl border border-[rgba(148,163,184,0.35)] bg-transparent px-5 py-3.5 text-sm font-semibold text-[#94a3b8] transition hover:border-[#ffd60a]/50 hover:text-[#f8fafc]";

type Tool = {
  badge: string | null;
  badgeExtra: string | null;
  featured: boolean;
  comingSoon: boolean;
  logo: string | null;
  logoAlt: string;
  logoClassName?: string;
  title: string;
  sport: string;
  description: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  freeAnalyzer?: boolean;
};

const tools: Tool[] = [
  {
    badge: "FREE — No login",
    badgeExtra: null,
    featured: true,
    comingSoon: false,
    logo: "/images/swing-analyzer-logo.png",
    logoAlt: "Swing Analyzer AI",
    logoClassName: "max-h-[88px] max-w-[100px]",
    title: "Free Swing Analyzer",
    sport: "Baseball · Softball · Golf",
    description: "Describe what you see and get a coaching breakdown in under 60 seconds.",
    bullets: [
      "Swing and pitching",
      "Copy, download, or email results",
      "No account needed",
    ],
    href: "free-breakdown",
    ctaLabel: "Open Free Analyzer",
    freeAnalyzer: true,
  },
  {
    badge: "Lead tool",
    badgeExtra: "Coming soon",
    featured: false,
    comingSoon: true,
    logo: "/images/practice-planner-logo.png",
    logoAlt: "Practice Planner",
    logoClassName: "max-h-[96px]",
    title: "Practice Planner",
    sport: "Baseball · Softball",
    description: "Build organized practices in minutes. MVP coach access opens here when ready.",
    bullets: [
      "Drill library built in",
      "Offensive, defensive, or full practices",
      "Save and reuse what works",
    ],
    href: "/practice-planner",
    ctaLabel: "Practice Planner — coming soon",
  },
  {
    badge: null,
    badgeExtra: "Coming soon",
    featured: false,
    comingSoon: true,
    logo: "/images/break90-logo.png",
    logoAlt: "Break90 Golf",
    logoClassName: "max-h-[72px] max-w-[160px]",
    title: "Break90 Golf",
    sport: "Golf",
    description: "AI golf coach for athletes. MVP golfer access opens here when ready.",
    bullets: [
      "Round tracking and patterns",
      "Practice focus after every round",
      "Built for real golfers",
    ],
    href: "/break90",
    ctaLabel: "Break90 — coming soon",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#071426] text-[#f8fafc]">
      <section
        id="top"
        aria-label="App launch"
        className="border-b border-[rgba(148,163,184,0.18)] bg-[#0b1f3a] pt-24 pb-12 sm:pb-16"
      >
        <div className="mx-auto w-full max-w-[min(1200px,92vw)] px-[4vw]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">
            App hub
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-[#f8fafc] sm:text-4xl">
            Launch a coaching tool
          </h1>
          <p className="mt-3 max-w-xl text-base text-[#94a3b8] sm:text-lg">
            Free Swing Analyzer is live. Practice Planner and Break90 Golf are coming soon — MVP
            pages are ready for when we open access. Full marketing story on WordPress.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#tools" className={btnPrimary}>
              Choose a tool below
            </a>
            <a
              href={marketingSiteUrl}
              className={btnSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              Full marketing site →
            </a>
          </div>
        </div>
      </section>

      <section
        id="tools"
        aria-labelledby="tools-title"
        className="bg-[#071426] py-14 sm:py-16"
      >
        <div className="mx-auto w-full max-w-[min(1200px,92vw)] px-[4vw]">
          <header className="mx-auto max-w-[640px] text-center">
            <h2 id="tools-title" className="text-2xl font-bold text-[#f8fafc] sm:text-3xl">
              Open a tool
            </h2>
            <p className="mt-2 text-[#94a3b8]">
              One tool live today. MVP landing pages for Practice Planner and Break90 are ready
              for launch.
            </p>
          </header>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <article
                key={tool.title}
                className={`flex flex-col rounded-xl border p-7 ${
                  tool.comingSoon
                    ? "border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.65)] opacity-95"
                    : tool.featured
                      ? "border-[#ffd60a]/45 bg-[rgba(11,31,58,0.65)] shadow-[0_0_0_1px_rgba(255,214,10,0.12)] transition hover:-translate-y-0.5 hover:border-[#ffd60a]/35 hover:shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
                      : "border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.65)] transition hover:-translate-y-0.5 hover:border-[#ffd60a]/35"
                }`}
              >
                <div
                  className={`mb-3 flex min-h-[1.625rem] items-start gap-1.5 ${
                    tool.badge && tool.badgeExtra ? "flex-wrap" : ""
                  }`}
                >
                  {tool.badge ? (
                    <span className="rounded bg-[#ffd60a]/[0.22] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-[#ffd60a]">
                      {tool.badge}
                    </span>
                  ) : null}
                  {tool.badgeExtra ? (
                    <span
                      className={`rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        tool.comingSoon
                          ? "bg-white/10 text-[#94a3b8]"
                          : "bg-[#ffd60a]/15 text-[#ffd60a]"
                      }`}
                    >
                      {tool.badgeExtra}
                    </span>
                  ) : null}
                </div>

                {tool.logo ? (
                  <div className="mb-5 flex h-[120px] items-center justify-center rounded-xl bg-[rgba(248,250,252,0.08)] p-3">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-white px-3 py-2">
                      <Image
                        src={tool.logo}
                        alt={tool.logoAlt}
                        width={160}
                        height={96}
                        className={`h-auto w-auto object-contain ${tool.logoClassName ?? "max-h-[96px] max-w-full"}`}
                      />
                    </div>
                  </div>
                ) : null}

                <h3 className="text-lg font-bold text-[#f8fafc]">{tool.title}</h3>
                <p className="mt-0.5 text-xs font-medium text-[#94a3b8]">{tool.sport}</p>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#94a3b8]">
                  {tool.description}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {tool.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[#f8fafc]/85">
                      <span className="mt-0.5 font-bold text-[#ffd60a]">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {tool.freeAnalyzer ? (
                  <FreeBreakdownTrackedLink
                    location="home_card"
                    className={`${btnPrimary} mt-6 w-full`}
                  >
                    {tool.ctaLabel}
                  </FreeBreakdownTrackedLink>
                ) : (
                  <Link href={tool.href} className={`${btnComingSoon} mt-6 w-full`}>
                    {tool.ctaLabel}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-[rgba(148,163,184,0.18)] bg-[#0b1f3a]">
        <div className="mx-auto w-full max-w-[min(1200px,92vw)] px-[4vw] py-5">
          <p className="text-center text-sm text-[#94a3b8]">
            Marketing, SEO, and program story:{" "}
            <a
              href={marketingSiteUrl}
              className="font-semibold text-[#ffd60a] no-underline hover:text-[#ffe566]"
              target="_blank"
              rel="noopener noreferrer"
            >
              aicoachingsolutions.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
