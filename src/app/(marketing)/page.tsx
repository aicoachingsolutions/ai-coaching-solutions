import Image from "next/image";
import Link from "next/link";
import { AppHomeHero } from "@/components/app-home-hero";
import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";
import { btnComingSoon, btnPrimary, marketingContainer } from "@/lib/marketing-buttons";

/** Live Break90 founding-golfer funnel — the ?mvp=golfer param lands new users on the enrollment page. */
const BREAK90_MVP_URL = "https://break90.app/signin?mvp=golfer";

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
  /** External live link (e.g. the Break90 app) — renders a primary button, opens the app. */
  external?: boolean;
};

const tools: Tool[] = [
  {
    badge: "60 days Pro — MVP",
    badgeExtra: "Live now",
    featured: true,
    comingSoon: false,
    external: true,
    logo: "/images/break90-logo.png",
    logoAlt: "Break90 Golf",
    logoClassName: "max-h-[72px] max-w-[160px]",
    title: "Break90 Golf",
    sport: "Golf",
    description:
      "Founding golfer MVP is live: full Pro for 60 days free — a coach read and practice plan after every real round. Earn up to 120 days.",
    bullets: [
      "All Pro features during your access",
      "Coach read + a drill after every round",
      "60 days free — no credit card",
    ],
    href: BREAK90_MVP_URL,
    ctaLabel: "Start 60 days of Pro — free",
  },
  {
    badge: "FREE — No login",
    badgeExtra: null,
    featured: false,
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
    badge: "60 days Pro — MVP",
    badgeExtra: "Opening soon",
    featured: false,
    comingSoon: true,
    logo: "/images/practice-planner-logo.png",
    logoAlt: "Practice Planner",
    logoClassName: "max-h-[96px]",
    title: "Practice Planner",
    sport: "Baseball · Softball",
    description:
      "Founding coach program (coming soon): full Pro for 60 days free — feedback on real practice plans. Earn up to 120 days.",
    bullets: [
      "All Pro features during access",
      "2 check-ins + real plans we ask for",
      "Join the waitlist to get early access",
    ],
    href: "/practice-planner",
    ctaLabel: "Practice Planner — coming soon",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#071426] text-[#f8fafc]">
      <AppHomeHero />

      <section
        id="tools"
        aria-labelledby="tools-title"
        className="bg-[#071426] py-14 sm:py-16"
      >
        <div className={marketingContainer}>
          <header className="mx-auto max-w-[720px] text-center">
            <h2 id="tools-title" className="text-2xl font-bold text-[#f8fafc] sm:text-3xl">
              Coaching Tools Built for Your Program
            </h2>
            <p className="mt-3 text-[#94a3b8]">
              Break90 Golf founding MVP is live now — 60 days of Pro free, up to 120 days with
              milestones. Free Swing Analyzer is free to use anytime. Practice Planner for coaches
              is coming soon.
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
                ) : tool.external ? (
                  <a href={tool.href} className={`${btnPrimary} mt-6 w-full`}>
                    {tool.ctaLabel}
                  </a>
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
    </div>
  );
}
