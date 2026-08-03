"use client";

import Image from "next/image";
import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { CoachingLinesSignupForm } from "@/components/coaching-lines-signup-form";

const SOURCE = "fb-tiktok-coaching-lines";
const COVER_SRC = "/images/the-lines-coaches-never-forget-cover.png";
const SAMPLE_SRC = "/images/the-lines-sample-at-practice.png";

const MOMENTS = [
  "When a kid makes a mistake",
  "When the effort drops",
  "At practice",
  "Showing up",
  "When it gets hard",
  "Character",
  "The ones they repeat twenty years later",
  "The ones that made them laugh",
];

export default function CoachingLinesPage() {
  useEffect(() => {
    let utmSource = "";
    try {
      utmSource = new URLSearchParams(window.location.search).get("utm_source") || "";
    } catch {
      /* ignore */
    }
    track("Lead Magnet Page View", {
      source: SOURCE,
      ...(utmSource ? { utm_source: utmSource } : {}),
    });
  }, []);

  return (
    <div>
      {/* Mobile-first hero: copy + form, then cover. Desktop: form left, cover right. */}
      <section className="border-b border-[rgba(148,163,184,0.18)] bg-[#0b1f3a]">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_minmax(0,16rem)] lg:items-center lg:gap-12 lg:py-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a] sm:text-[13px]">
              Free PDF · From Coach V
            </p>
            <h1 className="mt-3 text-[2rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[3rem] lg:leading-[1.08]">
              The Lines
              <br />
              Coaches Never Forget
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#e2e8f0] sm:mt-4 sm:text-lg">
              101 things worth saying at practice — from{" "}
              <span className="font-semibold text-white">2,280</span> coaches, players, and parents.
            </p>

            <div
              id="get-pdf"
              className="mt-6 rounded-2xl border border-white/10 bg-[#071426]/80 p-4 sm:mt-8 sm:max-w-md sm:p-5"
            >
              <CoachingLinesSignupForm idPrefix="hero" />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[11rem] sm:max-w-[13rem] lg:max-w-none">
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
      </section>

      {/* Mobile-first proof: moments first, sample after. Desktop: moments + sample side by side. */}
      <section
        className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_minmax(0,17rem)] lg:items-start lg:gap-12"
        aria-labelledby="inside-title"
      >
        <div>
          <h2 id="inside-title" className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Eight moments. One hundred and one lines.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#94a3b8] sm:mt-3 sm:text-base">
            Sorted by the moment you&apos;d actually reach for them — not strategy, the sentences that
            stuck for twenty years.
          </p>
          <ol className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
            {MOMENTS.map((label, i) => (
              <li
                key={label}
                className="flex items-baseline gap-3 border-b border-[rgba(148,163,184,0.12)] pb-2.5 text-[15px] text-[#e2e8f0] sm:pb-3 sm:text-base"
              >
                <span className="w-6 shrink-0 font-bold tabular-nums text-[#ffd60a] sm:w-7">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {label}
              </li>
            ))}
          </ol>

          <div className="mt-8 max-w-md rounded-2xl border border-white/10 bg-[#0b1f3a]/60 p-4 sm:mt-10 sm:p-5">
            <p className="mb-3 text-sm font-medium text-[#f8fafc]/90">Still need your copy?</p>
            <CoachingLinesSignupForm idPrefix="bottom" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[14rem] sm:max-w-[16rem] lg:sticky lg:top-6 lg:max-w-none">
          <Image
            src={SAMPLE_SRC}
            alt="Sample page from The Lines Coaches Never Forget — At practice"
            width={680}
            height={880}
            className="h-auto w-full rounded-lg bg-white shadow-[0_16px_40px_rgba(0,0,0,0.3)] ring-1 ring-white/10"
          />
          <p className="mt-2 text-center text-xs text-[#94a3b8] lg:text-left">
            Sample page · At practice
          </p>
        </div>
      </section>
    </div>
  );
}
