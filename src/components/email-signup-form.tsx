"use client";

import { useState } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

type EmailSignupFormProps = {
  source?: string;
  type?: "signup" | "waitlist";
  buttonLabel?: string;
  successMessage?: string;
};

export function EmailSignupForm({
  source = "homepage",
  type = "signup",
  buttonLabel = "Get Coaching Notes",
  successMessage = "Thanks. Check your inbox for a confirmation email.",
}: EmailSignupFormProps) {
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
    } catch {
      setState("error");
      setMessage("Could not send right now. Please try again.");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@school.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-w-0 rounded-md border border-black/15 bg-white px-4 py-3 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 sm:flex-1"
          required
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "sending" ? "Sending..." : buttonLabel}
        </button>
      </form>
      {message ? (
        <p
          className={`mt-2 text-xs ${
            state === "success" ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </>
  );
}
