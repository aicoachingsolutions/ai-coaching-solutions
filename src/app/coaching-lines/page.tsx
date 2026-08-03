"use client";

import Image from "next/image";
import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { CoachingLinesSignupForm } from "@/components/coaching-lines-signup-form";

const SOURCE = "fb-tiktok-coaching-lines";
const COVER_SRC = "/images/the-lines-coaches-never-forget-cover.png";

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
      <section className="relative overflow-hidden border-b border-[rgba(148,163,184,0.18)] bg-[#0b1f3a]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,214,10,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255,214,10,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">
            Free PDF · From Coach V
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.1rem] lg:leading-[1.08]">
            The Lines
            <br />
            Coaches Never Forget
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#e2e8f0] sm:text-xl">
            101 things worth saying at practice — collected from{" "}
            <span className="font-semibold text-white">2,280</span> coaches, players, and parents.
          </p>

          <div
            id="get-pdf"
            className="mt-8 max-w-md rounded-2xl border border-white/10 bg-[#071426]/70 p-5 backdrop-blur-sm sm:p-6"
          >
            <CoachingLinesSignupForm idPrefix="hero" />
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16"
        aria-labelledby="inside-title"
      >
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-14">
          <div className="mx-auto w-full max-w-[16rem] lg:mx-0 lg:sticky lg:top-8">
            <Image
              src={COVER_SRC}
              alt="The Lines Coaches Never Forget — free PDF cover"
              width={540}
              height={720}
              className="h-auto w-full rounded-lg shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
            />
          </div>

          <div>
            <h2 id="inside-title" className="text-2xl font-bold text-white sm:text-3xl">
              Eight moments. One hundred and one lines.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#94a3b8]">
              Sorted by the moment you&apos;d actually reach for them — not strategy, the sentences
              that stuck for twenty years.
            </p>
            <ol className="mt-8 space-y-3">
              {MOMENTS.map((label, i) => (
                <li
                  key={label}
                  className="flex items-baseline gap-3 border-b border-[rgba(148,163,184,0.12)] pb-3 text-base text-[#e2e8f0]"
                >
                  <span className="w-7 shrink-0 font-bold tabular-nums text-[#ffd60a]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </li>
              ))}
            </ol>

            <div className="mt-12 max-w-md rounded-2xl border border-white/10 bg-[#0b1f3a]/60 p-5 sm:p-6">
              <p className="mb-4 text-sm font-medium text-[#f8fafc]/90">Still need your copy?</p>
              <CoachingLinesSignupForm idPrefix="bottom" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
