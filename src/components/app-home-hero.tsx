"use client";

import Link from "next/link";
import { EmailSignupForm } from "@/components/email-signup-form";
import {
  btnPrimarySm,
  btnSecondarySm,
  marketingContainer,
} from "@/lib/marketing-buttons";

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
          One AI Platform. Multiple Coaching Solutions.
        </h1>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[#f8fafc]/90 sm:text-lg">
          Coaching tools for real programs — practice planning, swing analysis, and more. Built for
          coaches and athletes.
        </p>

        <div className="mt-6 max-w-xl">
          <aside
            className="rounded-xl border border-[rgba(255,214,10,0.35)] bg-[rgba(7,20,38,0.55)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-5"
            aria-label="Early access programs"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd60a]">
              Early access coming soon
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[#f8fafc]/92">
              Founding coach and golfer programs include{" "}
              <strong className="font-semibold text-[#f8fafc]">60 days of Pro free</strong> when
              access opens. Free Swing Analyzer is live now in the tools section below — each MVP
              program page has full details.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/practice-planner" className={btnPrimarySm}>
                Founding coach program
              </Link>
              <Link href="/break90" className={btnSecondarySm}>
                Founding golfer program
              </Link>
            </div>
          </aside>

          <div
            className="mt-4 rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.65)] p-4 sm:p-5"
            aria-label="Early access email signup"
          >
            <h2 className="text-base font-bold text-[#f8fafc]">Join the waitlist</h2>
            <p className="mt-1.5 text-sm text-[#94a3b8]">
              Get notified when founding coach or golfer access opens — Practice Planner or
              Break90 Golf, 60 days of Pro free.
            </p>
            <div className="mt-4 [&_input]:border-white/20 [&_input]:bg-[#071426] [&_input]:text-white [&_input]:placeholder:text-[#94a3b8] [&_button]:border-[#ffd60a] [&_button]:bg-[#ffd60a] [&_button]:text-[#071426] [&_button]:hover:bg-[#ffe566]">
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
