"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { EmailSignupForm } from "@/components/email-signup-form";

const PDF_PATH = "/downloads/the-lines-coaches-never-forget.pdf";
const SOURCE = "fb-tiktok-coaching-lines";

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
      {/* Hero — one composition */}
      <section className="relative overflow-hidden border-b border-[rgba(148,163,184,0.18)] bg-[#0b1f3a]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,214,10,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(255,214,10,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">
            Free PDF · Instant download
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
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
            className="mt-10 max-w-md rounded-2xl border border-white/10 bg-[#071426]/70 p-5 backdrop-blur-sm sm:p-6"
          >
            <p className="mb-4 text-sm font-medium text-[#f8fafc]/90">
              Enter your email. Get the PDF now.
            </p>
            <EmailSignupForm
              source={SOURCE}
              type="signup"
              layout="stacked"
              buttonLabel="Send me the free PDF"
              successMessage="You're in. Download starts now — check your email for the link too."
              downloadUrl={PDF_PATH}
              downloadLabel="Download your PDF"
              inputId="coaching-lines-email"
            />
            <p className="mt-3 text-xs text-[#94a3b8]">Free · Instant download · No spam</p>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="inside-title">
        <h2 id="inside-title" className="text-2xl font-bold text-white sm:text-3xl">
          Eight moments. One hundred and one lines.
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[#94a3b8]">
          Sorted by the moment you&apos;d actually reach for them — not strategy, the sentences that
          stuck for twenty years.
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

        <div className="mt-12 max-w-md">
          <p className="mb-4 text-sm font-medium text-[#f8fafc]/90">Still need your copy?</p>
          <EmailSignupForm
            source={SOURCE}
            type="signup"
            layout="stacked"
            buttonLabel="Send me the free PDF"
            successMessage="You're in. Download starts now — check your email for the link too."
            downloadUrl={PDF_PATH}
            downloadLabel="Download your PDF"
            inputId="coaching-lines-email-bottom"
          />
        </div>
      </section>
    </div>
  );
}
