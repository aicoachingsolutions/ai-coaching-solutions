import Image from "next/image";
import Link from "next/link";
import { EmailSignupForm } from "@/components/email-signup-form";
import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";

export type MvpComingSoonConfig = {
  product: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  features: string[];
  audience: "coaches" | "golfers";
  logo?: string;
  waitlistSource: string;
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-5 py-3.5 text-sm font-semibold text-[#071426] transition hover:bg-[#ffe566]";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-white/35 bg-transparent px-5 py-3.5 text-sm font-semibold text-[#f8fafc] transition hover:border-white hover:bg-white/[0.06]";

export function MvpComingSoonPage({ config }: { config: MvpComingSoonConfig }) {
  const isGolfer = config.audience === "golfers";
  const mvpBadge = isGolfer ? "MVP golfers — opening soon" : "MVP coaches — opening soon";
  const mvpTitle = isGolfer
    ? "Help us improve your AI golf coach"
    : `Help launch ${config.product}`;
  const mvpText = isGolfer
    ? "Break90 is your AI golf coach — built to guide improvement between rounds. We are finishing the first release; MVP golfer access will open here when ready."
    : `We are building ${config.product} with coaches who run real practices. MVP coach access will open here when the app is ready — join the waitlist to hear first.`;

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
                Coming soon
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
                  ← App hub
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
              <div className="flex h-[200px] w-full max-w-sm items-center justify-center rounded-xl bg-[rgba(248,250,252,0.08)] p-6 lg:h-[240px] lg:flex-shrink-0">
                <Image
                  src={config.logo}
                  alt={config.product}
                  width={200}
                  height={120}
                  className="h-auto max-h-[140px] w-auto max-w-full object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[min(720px,92vw)] px-[4vw]">
          <aside
            className="rounded-xl border border-[#ffd60a]/35 bg-[#ffd60a]/[0.08] p-6 sm:p-8"
            aria-label={`${config.product} MVP program`}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd60a]">
              {mvpBadge}
            </p>
            <p className="mt-2 text-lg font-bold text-[#f8fafc]">{mvpTitle}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#94a3b8]">{mvpText}</p>
            <p className="mt-4 text-sm text-[#f8fafc]/75">
              The app is not open for MVP testing yet. Leave your email and we will notify you
              when {config.product} is ready to try on this site.
            </p>
          </aside>

          <div className="mt-8 rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.65)] p-6">
            <h2 className="text-lg font-bold text-[#f8fafc]">Get notified</h2>
            <p className="mt-2 text-sm text-[#94a3b8]">
              Join the waitlist for {config.product}. No spam — only launch updates.
            </p>
            <div className="mt-4 [&_input]:border-white/20 [&_input]:bg-[#071426] [&_input]:text-white [&_button]:border-[#ffd60a] [&_button]:bg-[#ffd60a] [&_button]:text-[#071426]">
              <EmailSignupForm
                source={config.waitlistSource}
                type="waitlist"
                buttonLabel={isGolfer ? "Notify me — MVP golfer" : "Notify me — MVP coach"}
                successMessage="You are on the list. We will email you when MVP access opens."
              />
            </div>
            <p className="mt-4 text-sm text-[#94a3b8]">
              Questions?{" "}
              <Link href="/contact" className="font-medium text-[#ffd60a] hover:text-[#ffe566]">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
