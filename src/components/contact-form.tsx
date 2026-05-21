"use client";

import { useState } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-white/20 bg-[#071426] px-4 py-3.5 text-base text-[#f8fafc] placeholder:text-[#94a3b8]/80 outline-none transition focus:border-[#ffd60a]/50 focus:ring-2 focus:ring-[#ffd60a]/20";
const labelClass = "text-sm font-medium text-[#f8fafc]";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          source: "contact-page",
          firstName,
          lastName,
          email,
          message: note,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setState("error");
        setFeedback(data.error || "Could not send right now. Please try again.");
        return;
      }
      setState("success");
      setFeedback("Message sent. Check your inbox for a confirmation email.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setNote("");
    } catch {
      setState("error");
      setFeedback("Could not send right now. Please try again.");
    }
  }

  return (
    <form
      className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.65)] p-6 sm:p-8"
      onSubmit={onSubmit}
    >
      <h2 className="text-xl font-bold text-[#f8fafc]">Send a message</h2>
      <p className="mt-2 text-sm text-[#94a3b8]">
        We typically reply within a few business days.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className={labelClass} htmlFor="contact-first">
            First name
          </label>
          <input
            id="contact-first"
            name="firstName"
            className={fieldClass}
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass} htmlFor="contact-last">
            Last name
          </label>
          <input
            id="contact-last"
            name="lastName"
            className={fieldClass}
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label className={labelClass} htmlFor="contact-email">
          Your email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="you@school.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label className={labelClass} htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          className={`${fieldClass} resize-y min-h-[140px]`}
          placeholder="What can we help with? Include the tool (Practice Planner, Break90, Free Analyzer) and any details that help."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#94a3b8]">Messages are read personally.</p>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#ffd60a] bg-[#ffd60a] px-6 py-3.5 text-sm font-semibold text-[#071426] transition hover:bg-[#ffe566] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "sending" ? "Sending..." : "Send message"}
        </button>
      </div>

      {feedback ? (
        <p
          className={`mt-4 text-sm ${
            state === "success" ? "text-[#ffd60a]" : "text-red-300"
          }`}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
