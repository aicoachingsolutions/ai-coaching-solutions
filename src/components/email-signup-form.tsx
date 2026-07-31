"use client";

import { useId, useState } from "react";
import { track } from "@vercel/analytics";

type SubmitState = "idle" | "sending" | "success" | "error";

type EmailSignupFormProps = {
  source?: string;
  type?: "signup" | "waitlist";
  buttonLabel?: string;
  successMessage?: string;
  /** stacked = full-width email above button (MVP pages under product logo) */
  layout?: "inline" | "stacked";
  /** When set, success state offers this PDF and auto-starts download */
  downloadUrl?: string;
  downloadLabel?: string;
  inputId?: string;
};

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

export function EmailSignupForm({
  source = "homepage",
  type = "signup",
  buttonLabel = "Get Coaching Notes",
  successMessage = "Thanks. Check your inbox for a confirmation email.",
  layout = "inline",
  downloadUrl,
  downloadLabel = "Download your PDF",
  inputId,
}: EmailSignupFormProps) {
  const generatedId = useId();
  const emailInputId = inputId ?? `email-${generatedId}`;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setState("error");
      setMessage("Enter an email address.");
      return;
    }

    setState("sending");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source, type }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setState("error");
        setMessage(data.error || "Could not send right now. Please try again.");
        return;
      }

      setState("success");
      setMessage(successMessage);
      setEmail("");

      const utmSource = getUtmSource();
      track("Lead Magnet Signup", {
        source,
        ...(utmSource ? { utm_source: utmSource } : {}),
      });

      if (downloadUrl) {
        triggerDownload(downloadUrl);
        track("Lead Magnet Download", {
          source,
          trigger: "auto",
          ...(utmSource ? { utm_source: utmSource } : {}),
        });
      }
    } catch {
      setState("error");
      setMessage("Could not send right now. Please try again.");
    }
  }

  const isStacked = layout === "stacked";

  if (state === "success" && downloadUrl) {
    return (
      <div className="flex w-full flex-col gap-3">
        <p className={`text-sm font-medium ${isStacked ? "text-[#ffd60a]" : "text-emerald-700"}`}>
          {message || "Your PDF is ready."}
        </p>
        <a
          href={downloadUrl}
          download
          onClick={() => {
            const utmSource = getUtmSource();
            track("Lead Magnet Download", {
              source,
              trigger: "click",
              ...(utmSource ? { utm_source: utmSource } : {}),
            });
          }}
          className={
            isStacked
              ? "inline-flex w-full items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-6 py-3.5 text-sm font-semibold text-[#071426] transition hover:bg-[#ffe566]"
              : "inline-flex w-full items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
          }
        >
          {downloadLabel}
        </a>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={
          isStacked
            ? "flex w-full flex-col gap-3"
            : "flex w-full flex-col gap-3 sm:flex-row sm:items-center"
        }
      >
        <label className="sr-only" htmlFor={emailInputId}>
          Email
        </label>
        <input
          id={emailInputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@school.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={
            isStacked
              ? "w-full min-w-[min(100%,20rem)] rounded-xl border border-white/20 bg-[#071426] px-4 py-3.5 text-base text-white placeholder:text-white/40 focus:border-[#ffd60a]/50 focus:outline-none focus:ring-2 focus:ring-[#ffd60a]/25"
              : "w-full min-w-0 rounded-md border border-black/15 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 sm:flex-1"
          }
          required
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={
            isStacked
              ? "inline-flex w-full items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-6 py-3.5 text-sm font-semibold text-[#071426] transition hover:bg-[#ffe566] disabled:cursor-not-allowed disabled:opacity-70"
              : "inline-flex shrink-0 items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          }
        >
          {state === "sending" ? "Sending..." : buttonLabel}
        </button>
      </form>
      {message ? (
        <p
          className={`mt-2 text-xs ${
            state === "success"
              ? isStacked
                ? "text-[#ffd60a]"
                : "text-emerald-700"
              : isStacked
                ? "text-red-300"
                : "text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </>
  );
}
