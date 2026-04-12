"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { PRACTICE_PLAN_MAX_ITEMS } from "@/lib/practice-plan-limits";
import { savePracticePlanAction } from "./actions";

export type EditorDrillOption = { id: string; title: string };

export type EditorItem = {
  drillId: string;
  durationMinutes: number;
  notes: string;
};

type Props = {
  planId: string;
  initialTitle: string;
  initialFocus: string;
  initialNotes: string;
  initialPracticeDate: string;
  drills: EditorDrillOption[];
  initialItems: EditorItem[];
};

const DURATION_MIN = 1;
const DURATION_MAX = 180;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function clampMinutes(value: number): number {
  if (!Number.isFinite(value)) {
    return DURATION_MIN;
  }
  return Math.min(DURATION_MAX, Math.max(DURATION_MIN, Math.trunc(value)));
}

export function PracticePlanEditor({
  planId,
  initialTitle,
  initialFocus,
  initialNotes,
  initialPracticeDate,
  drills,
  initialItems,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [focus, setFocus] = useState(initialFocus);
  const [notes, setNotes] = useState(initialNotes);
  const [practiceDate, setPracticeDate] = useState(initialPracticeDate);
  const [items, setItems] = useState<(EditorItem & { key: string })[]>(() =>
    initialItems.map((it) => ({ ...it, key: uid() }))
  );
  const [pickDrillId, setPickDrillId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const totalMinutes = useMemo(
    () => items.reduce((sum, it) => sum + (Number.isFinite(it.durationMinutes) ? it.durationMinutes : 0), 0),
    [items]
  );

  const itemsJson = useMemo(
    () =>
      JSON.stringify(
        items.map(({ drillId, durationMinutes, notes: n }) => ({
          drillId,
          durationMinutes,
          notes: n.trim() ? n : null,
        }))
      ),
    [items]
  );

  function addDrill() {
    if (!pickDrillId) return;
    if (items.length >= PRACTICE_PLAN_MAX_ITEMS) {
      setError(`You can have at most ${PRACTICE_PLAN_MAX_ITEMS} blocks. Remove one to add another.`);
      return;
    }
    setError(null);
    setItems((prev) => [
      ...prev,
      { key: uid(), drillId: pickDrillId, durationMinutes: 10, notes: "" },
    ]);
    setPickDrillId("");
  }

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      const tmp = copy[index];
      copy[index] = copy[next]!;
      copy[next] = tmp!;
      return copy;
    });
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, patch: Partial<EditorItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function submit() {
    if (items.length === 0) return;
    setError(null);
    const fd = new FormData();
    fd.set("planId", planId);
    fd.set("title", title);
    fd.set("focus", focus);
    fd.set("notes", notes);
    fd.set("practiceDate", practiceDate);
    fd.set("itemsJson", itemsJson);
    startTransition(async () => {
      const res = await savePracticePlanAction(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-sky-200 bg-sky-50/90 px-4 py-3 text-sm text-neutral-900">
        <p className="font-medium">Clean up your plan</p>
        <p className="mt-1 text-neutral-800">
          Move blocks up or down, change minutes, edit notes, remove a block, or add another drill from your library.
          Tap <span className="font-semibold">Save plan</span> when you are done — changes are not saved until then.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-neutral-800">
          Total planned time: <span className="text-neutral-950">{totalMinutes} min</span>
          <span className="ml-2 font-normal text-neutral-600">
            ({items.length} block{items.length === 1 ? "" : "s"})
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="pptitle" className="block text-sm font-medium text-neutral-800">
            Title
          </label>
          <input
            id="pptitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="ppdate" className="block text-sm font-medium text-neutral-800">
            Practice date <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="ppdate"
            type="date"
            value={practiceDate}
            onChange={(e) => setPracticeDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 sm:text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ppfocus" className="block text-sm font-medium text-neutral-800">
            Focus <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="ppfocus"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            maxLength={2000}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 sm:text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ppnotes" className="block text-sm font-medium text-neutral-800">
            Plan notes <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <textarea
            id="ppnotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={8000}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20 sm:text-sm"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-900">Drill blocks</h2>
        <p className="mt-1 text-xs text-neutral-600">
          Up to {PRACTICE_PLAN_MAX_ITEMS} blocks. Reorder with the buttons on each card; minutes are {DURATION_MIN}–
          {DURATION_MAX} per block.
        </p>

        {drills.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-700">Add drills in your library first.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="pickdrill" className="block text-xs font-medium text-neutral-600">
                Add from library
              </label>
              <select
                id="pickdrill"
                value={pickDrillId}
                onChange={(e) => setPickDrillId(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm sm:text-sm"
              >
                <option value="">Choose a drill…</option>
                {drills.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={addDrill}
              disabled={!pickDrillId || items.length >= PRACTICE_PLAN_MAX_ITEMS}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl bg-[#0b2340] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#103055] disabled:opacity-50 sm:w-auto"
            >
              Add block
            </button>
          </div>
        )}

        <ul className="mt-4 space-y-4">
          {items.length === 0 ? (
            <li className="text-sm text-neutral-600">
              No blocks yet. Pick a drill above and tap <span className="font-medium">Add block</span>, or add drills in
              your library first.
            </li>
          ) : (
            items.map((it, index) => {
              const drillTitle = drills.find((d) => d.id === it.drillId)?.title ?? "Drill";
              const position = index + 1;
              return (
                <li
                  key={it.key}
                  className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-medium text-neutral-900">
                      <span className="text-neutral-500">#{position}</span> {drillTitle}
                    </p>
                    <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:max-w-md sm:shrink-0">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move ${drillTitle} up from position ${position}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-2 text-sm font-medium text-neutral-800 active:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        aria-label={`Move ${drillTitle} down from position ${position}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-2 text-sm font-medium text-neutral-800 active:bg-neutral-100 disabled:pointer-events-none disabled:opacity-40"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => removeAt(index)}
                        aria-label={`Remove ${drillTitle} from position ${position}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-200 bg-white px-2 text-sm font-medium text-red-800 active:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600">Minutes</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={DURATION_MIN}
                        max={DURATION_MAX}
                        value={it.durationMinutes}
                        onChange={(e) =>
                          updateItem(index, {
                            durationMinutes: clampMinutes(Number(e.target.value)),
                          })
                        }
                        className="mt-1 min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-neutral-600">
                        Block notes <span className="font-normal text-neutral-500">(optional)</span>
                      </label>
                      <input
                        value={it.notes}
                        onChange={(e) => updateItem(index, { notes: e.target.value })}
                        maxLength={2000}
                        placeholder="Stations, groups, cue…"
                        className="mt-1 min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base sm:text-sm"
                      />
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-neutral-700" role="status">
          Add at least one drill block from your library above before you can save this plan.
        </p>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={pending || items.length === 0}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#0b2340] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#103055] disabled:opacity-60 sm:w-auto sm:text-sm"
      >
        {pending ? "Saving…" : "Save plan"}
      </button>
    </div>
  );
}
