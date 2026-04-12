"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePracticePlanAction } from "./actions";

export function DeletePlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run() {
    if (!window.confirm("Delete this practice plan? This cannot be undone.")) return;
    setError(null);
    startTransition(async () => {
      const res = await deletePracticePlanAction(planId);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/app/practice-planner");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="text-sm font-semibold text-red-800 underline-offset-4 hover:underline disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error ? <span className="max-w-[12rem] text-right text-xs text-red-700">{error}</span> : null}
    </div>
  );
}
