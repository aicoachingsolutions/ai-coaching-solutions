"use client";

import { EmailSignupForm } from "@/components/email-signup-form";
import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";
import {
  btnPrimarySm,
  btnSecondarySm,
  marketingContainer,
} from "@/lib/marketing-buttons";

/** Live Break90 founding-golfer funnel — ?mvp=golfer lands new users on enrollment. */
const BREAK90_MVP_URL = "https://break90.app/signin?mvp=golfer";

export function AppHomeHero() {
  return (
    <section
      id="top"
      aria-label="Coaching tools home"
      className="relative overflow-hidden border-b border-[rgba(148,163,184,0.18)] bg-[#071426]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0b1f3a] via-[#071426] to-[#071426]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(7,20,38,0.92)] via-[rgba(7,20,38,0.75)] to-[rgba(7,20,38,0.35)]"
        aria-hidden
      />

      <div className={`relative ${marketingContainer} py-12 sm:py-16`}>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">
          AI Coaching Solutions
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[#f8fafc] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
          One Platform. Every Coaching Tool.
        </h1>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[#f8fafc]/90 sm:text-lg">
          Coaching tools for real programs — practice planning, swing analysis, and more. Built for
          coaches and athletes.
        </p>

        <div className="mt-6 max-w-xl">
          <aside
            className="rounded-xl border border-[rgba(255,214,10,0.35)] bg-[rgba(7,20,38,0.55)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-5"
            aria-label="Founding golfer program — open now"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd60a]">
              Founding golfer MVP — open now
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#f8fafc]/92">
              <strong className="font-semibold text-[#f8fafc]">Break90 Golf</strong> founding program
              is live:{" "}
              <strong className="font-semibold text-[#f8fafc]">60 days of Pro free</strong>, no credit
              card — a coach read and practice plan after every round. Practice Planner for coaches is
              coming soon.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={BREAK90_MVP_URL} className={btnPrimarySm}>
                Start 60 days of Pro — free
              </a>
              <FreeBreakdownTrackedLink location="home_hero" className={btnSecondarySm}>
                Try Free Swing Analyzer
              </FreeBreakdownTrackedLink>
            </div>
          </aside>

          <div
            className="mt-4 rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.65)] p-4 sm:p-5"
            aria-label="Practice Planner waitlist"
          >
            <h2 className="text-base font-bold text-[#f8fafc]">Coaches — join the waitlist</h2>
            <p className="mt-1.5 text-sm text-[#e2e8f0]">
              Get notified when the Practice Planner founding coach program opens — 60 days of Pro
              free. (Golfers: Break90 is live now — start above.)
            </p>
            <div className="mt-4 [&_input]:border-white/20 [&_input]:bg-[#071426] [&_input]:text-white [&_input]:placeholder:text-[#e2e8f0] [&_button]:border-[#ffd60a] [&_button]:bg-[#ffd60a] [&_button]:text-[#071426] [&_button]:hover:bg-[#ffe566]">
              <EmailSignupForm
                source="app-home-early-access"
                type="waitlist"
                layout="stacked"
                buttonLabel="Notify me"
                successMessage="You are on the waitlist. Check your inbox for confirmation."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
