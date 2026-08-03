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

      <div className={`relative ${marketingContainer} py-8 sm:py-12 lg:py-16`}>
        {/* Mobile-first: offer + form, then cover. Desktop: form left, cover right. */}
        <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,13rem)] lg:items-start lg:gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a] sm:text-[13px]">
              AI Coaching Solutions · Coach V
            </p>
            <h1 className="mt-2 text-[1.75rem] font-extrabold leading-[1.12] tracking-tight text-[#f8fafc] sm:mt-3 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              The Lines Coaches Never Forget
            </h1>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[#f8fafc]/90 sm:mt-4 sm:text-lg">
              Free PDF — 101 things worth saying at practice, from 2,280 coaches, players, and
              parents. One email. Instant download.
            </p>

            <div className="mt-5 max-w-md sm:mt-6">
              <aside
                className="rounded-xl border border-[rgba(255,214,10,0.35)] bg-[rgba(7,20,38,0.55)] p-4 sm:p-5"
                aria-label="Free PDF signup"
              >
                <CoachingLinesSignupForm idPrefix="home-hero" />
              </aside>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap">
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

          <div className="mx-auto w-full max-w-[10rem] sm:max-w-[12rem] lg:max-w-none">
            <Image
              src={COVER_SRC}
              alt="The Lines Coaches Never Forget — free PDF cover"
              width={540}
              height={720}
              priority
              className="h-auto w-full rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.4)] ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
