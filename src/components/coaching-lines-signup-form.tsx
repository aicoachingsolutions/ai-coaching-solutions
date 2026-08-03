"use client";

import { useId, useState } from "react";
import { track } from "@vercel/analytics";

const PDF_PATH = "/downloads/the-lines-coaches-never-forget.pdf";
const SOURCE = "fb-tiktok-coaching-lines";

type SubmitState = "idle" | "sending" | "success" | "error";

function triggerDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function getUtmSource(): string {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get("utm_source") || "";
  } catch {
    return "";
  }
}

type Props = {
  idPrefix?: string;
};

export function CoachingLinesSignupForm({ idPrefix = "lines" }: Props) {
  const uid = useId();
  const emailId = `${idPrefix}-email-${uid}`;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [emailed, setEmailed] = useState(true);

  function finishSuccess(didEmail: boolean) {
    setState("success");
    setEmailed(didEmail);
    setMessage("");
    setEmail("");

    const utmSource = getUtmSource();
    track("Lead Magnet Signup", {
      source: SOURCE,
      emailed: didEmail ? "yes" : "no",
      ...(utmSource ? { utm_source: utmSource } : {}),
    });

    triggerDownload(PDF_PATH);
    track("Lead Magnet Download", {
      source: SOURCE,
      trigger: "auto",
      ...(utmSource ? { utm_source: utmSource } : {}),
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          source: SOURCE,
          type: "signup",
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !data.success) {
        finishSuccess(false);
        return;
      }

      finishSuccess(true);
    } catch {
      finishSuccess(false);
    }
  }

  if (state === "success") {
    return (
      <div className="space-y-5 text-left">
        <div>
          <h2 className="text-2xl font-bold text-white">It&apos;s on the way.</h2>
          <p className="mt-3 text-base leading-relaxed text-[#e2e8f0]">
            {emailed ? (
              <>
                Check your inbox in the next minute or two. If it&apos;s not there, look in Promotions
                or Spam and drag it over — that way you&apos;ll actually get the next one.
              </>
            ) : (
              <>
                Your download is ready below. We couldn&apos;t email the link right now — use the
                button and you&apos;re set.
              </>
            )}
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#e2e8f0]">
            One thing while you&apos;re here: hit reply to that email and tell me the line you still
            catch yourself saying. I&apos;m collecting them for the next one.
          </p>
        </div>

        <a
          href={PDF_PATH}
          download
          onClick={() => {
            const utmSource = getUtmSource();
            track("Lead Magnet Download", {
              source: SOURCE,
              trigger: "click",
              ...(utmSource ? { utm_source: utmSource } : {}),
            });
          }}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-6 py-3.5 text-base font-semibold text-[#071426] transition hover:bg-[#ffe566]"
        >
          Download the 101 Lines
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <label className="sr-only" htmlFor={emailId}>
        Email
      </label>
      <input
        id={emailId}
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-[#071426] px-4 py-3.5 text-base text-white placeholder:text-white/40 focus:border-[#ffd60a]/50 focus:outline-none focus:ring-2 focus:ring-[#ffd60a]/25"
        placeholder="Enter your email"
      />

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-6 py-3.5 text-base font-semibold text-[#071426] transition hover:bg-[#ffe566] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "sending" ? "Sending..." : "Send Me the 101 Lines"}
      </button>

      <p className="text-center text-xs leading-relaxed text-[#94a3b8]">
        One email with your download. Nothing else unless you want it.
      </p>

      {message ? <p className="text-xs text-red-300">{message}</p> : null}
    </form>
  );
}
