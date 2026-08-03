"use client";

import Image from "next/image";
import Link from "next/link";
import { CoachingLinesSignupForm } from "@/components/coaching-lines-signup-form";
import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";
import {
  btnPrimarySm,
  btnSecondarySm,
  marketingContainer,
} from "@/lib/marketing-buttons";

/** Live Break90 founding-golfer funnel — ?mvp=golfer lands new users on enrollment. */
const BREAK90_MVP_URL = "https://break90.app/signin?mvp=golfer";
const COVER_SRC = "/images/the-lines-coaches-never-forget-cover.png";

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
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-12">
          <div className="mx-auto w-full max-w-[14rem] lg:mx-0">
            <Image
              src={COVER_SRC}
              alt="The Lines Coaches Never Forget — free PDF cover"
              width={540}
              height={720}
              priority
              className="h-auto w-full rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.4)] ring-1 ring-white/10"
            />
          </div>

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">
              AI Coaching Solutions · Coach V
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[#f8fafc] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              The Lines Coaches Never Forget
            </h1>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[#f8fafc]/90 sm:text-lg">
              Free PDF — 101 things worth saying at practice, collected from 2,280 coaches, players,
              and parents. One email. Instant download.
            </p>

            <div className="mt-6 max-w-md">
              <aside
                className="rounded-xl border border-[rgba(255,214,10,0.35)] bg-[rgba(7,20,38,0.55)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-5"
                aria-label="Free PDF signup"
              >
                <CoachingLinesSignupForm idPrefix="home-hero" />
              </aside>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <FreeBreakdownTrackedLink location="home_hero" className={btnPrimarySm}>
                Try Free Swing Analyzer
              </FreeBreakdownTrackedLink>
              <a href={BREAK90_MVP_URL} className={btnSecondarySm}>
                Break90 Golf — 60 days Pro free
              </a>
              <Link href="/coaching-lines" className={btnSecondarySm}>
                Full PDF page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
