import Image from "next/image";
import Link from "next/link";
import { EmailSignupForm } from "@/components/email-signup-form";
import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";
import { MvpProgramDetails } from "@/components/mvp-program-details";
import type { MvpProgramDefinition } from "@/lib/mvp-programs";

export type MvpComingSoonConfig = {
  product: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  features: string[];
  audience: "coaches" | "golfers";
  logo?: string;
  waitlistSource: string;
  program: MvpProgramDefinition;
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-5 py-3.5 text-sm font-semibold text-[#071426] transition hover:bg-[#ffe566]";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-white/35 bg-transparent px-5 py-3.5 text-sm font-semibold text-[#f8fafc] transition hover:border-white hover:bg-white/[0.06]";

export function MvpComingSoonPage({ config }: { config: MvpComingSoonConfig }) {
  const isGolfer = config.audience === "golfers";

  return (
    <div className="bg-[#071426] text-[#f8fafc]">
      <section className="border-b border-[rgba(148,163,184,0.18)] bg-[#0b1f3a] pt-24 pb-12">
        <div className="mx-auto w-full max-w-[min(1200px,92vw)] px-[4vw]">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="max-w-xl flex-1">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">
                {config.eyebrow}
              </p>
              <span className="mt-3 inline-block rounded bg-[#ffd60a]/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#ffd60a]">
                60 days Pro — opening soon
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {config.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#94a3b8] sm:text-lg">
                {config.subtitle}
              </p>
              <ul className="mt-6 space-y-2">
                {config.features.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#f8fafc]/90">
                    <span className="mt-0.5 font-bold text-[#ffd60a]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/" className={btnSecondary}>
                  ← All tools
                </Link>
                <FreeBreakdownTrackedLink
                  location={`mvp_${config.waitlistSource}_hero`}
                  className={btnPrimary}
                >
                  Try Free Swing Analyzer
                </FreeBreakdownTrackedLink>
              </div>
            </div>

            {config.logo ? (
              <div className="flex w-full max-w-sm flex-col gap-5 lg:w-[min(100%,22rem)] lg:flex-shrink-0">
                <div className="flex h-[200px] items-center justify-center rounded-xl bg-[rgba(248,250,252,0.08)] p-4 lg:h-[220px]">
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-white px-4 py-3">
                    <Image
                      src={config.logo}
                      alt={config.product}
                      width={280}
                      height={160}
                      className="h-auto max-h-[140px] w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <p className="mb-3 text-sm font-semibold text-[#f8fafc]">
                    {isGolfer
                      ? "Join the Break90 founding golfer waitlist"
                      : "Join the Practice Planner founding coach waitlist"}
                  </p>
                  <EmailSignupForm
                    source={config.waitlistSource}
                    type="waitlist"
                    layout="stacked"
                    buttonLabel="Notify me"
                    successMessage="You are on the list. We will email you when MVP access opens."
                  />
                  <p className="mt-3 text-xs text-[#94a3b8]">
                    60 days of Pro free when we open the cohort.{" "}
                    <Link href="/contact" className="text-[#ffd60a] hover:text-[#ffe566]">
                      Questions?
                    </Link>
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 pb-16" aria-labelledby="mvp-program-heading">
        <div className="mx-auto w-full max-w-[min(800px,92vw)] px-[4vw]">
          <h2 id="mvp-program-heading" className="sr-only">
            {config.product} MVP program details
          </h2>
          <MvpProgramDetails program={config.program} />
        </div>
      </section>
    </div>
  );
}
