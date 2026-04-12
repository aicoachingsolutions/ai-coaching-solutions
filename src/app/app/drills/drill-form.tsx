"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteDrillAction, saveDrillAction } from "./actions";

type Props = {
  drillId?: string;
  initialTitle: string;
  initialNotes: string;
};

export function DrillForm({ drillId, initialTitle, initialNotes }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await saveDrillAction(formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/app/drills");
      router.refresh();
    });
  }

  function remove() {
    if (!drillId) return;
    if (!window.confirm("Delete this drill? It cannot be used in new plan blocks until you add it again.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await deleteDrillAction(drillId);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/app/drills");
      router.refresh();
    });
  }

  return (
    <form action={submit} className="space-y-4">
      {drillId ? <input type="hidden" name="drillId" value={drillId} /> : null}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-800">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          defaultValue={initialTitle}
          className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-neutral-800">
          Notes <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          maxLength={8000}
          defaultValue={initialNotes}
          className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {drillId ? (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-50 disabled:opacity-60"
          >
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
