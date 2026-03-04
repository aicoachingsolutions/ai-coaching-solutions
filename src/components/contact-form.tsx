"use client";

import { useState } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setMessage("");

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
        setMessage(data.error || "Could not send right now. Please try again.");
        return;
      }
      setState("success");
      setMessage("Message sent. Check your inbox for a confirmation email.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setNote("");
    } catch {
      setState("error");
      setMessage("Could not send right now. Please try again.");
    }
  }

  return (
    <form
      className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-800">First name</label>
          <input
            name="firstName"
            className="rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-800">Last name</label>
          <input
            name="lastName"
            className="rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-800">Email</label>
        <input
          name="email"
          type="email"
          required
          className="rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-800">Message</label>
        <textarea
          name="message"
          required
          rows={6}
          className="rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900"
          placeholder="What can I help with? If it’s about the free breakdown, include the sport, age, and what you’re seeing."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-500">Messages are read personally.</p>

        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "sending" ? "Sending..." : "Send"}
        </button>
      </div>

      {message ? (
        <p className={`mt-3 text-xs ${state === "success" ? "text-emerald-700" : "text-red-700"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
