"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SPORT_OPTIONS } from "@/lib/sport-codes";
import { saveTeamAction } from "./actions";

type Props = {
  initialName: string;
  initialSportCode: string;
  initialSeasonLabel: string;
};

export function TeamForm({ initialName, initialSportCode, initialSeasonLabel }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const result = await saveTeamAction(fd);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  const inputClass =
    "box-border w-full rounded-xl border-2 border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50";

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-lg space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-neutral-800">
          Team name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={120}
          defaultValue={initialName}
          className={inputClass}
          placeholder="e.g. JV Girls Basketball"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="sportCode" className="text-sm font-medium text-neutral-800">
          Sport <span className="text-red-600">*</span>
        </label>
        <select
          id="sportCode"
          name="sportCode"
          required
          defaultValue={initialSportCode}
          className={inputClass}
        >
          {SPORT_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="seasonLabel" className="text-sm font-medium text-neutral-800">
          Season <span className="text-neutral-500">(optional)</span>
        </label>
        <input
          id="seasonLabel"
          name="seasonLabel"
          maxLength={120}
          defaultValue={initialSeasonLabel}
          className={inputClass}
          placeholder="e.g. Spring 2026"
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving…" : "Save team"}
      </button>
    </form>
  );
}
