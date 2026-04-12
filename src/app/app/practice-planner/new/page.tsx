import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { loadDrillsForTeam } from "@/lib/drills";
import { createPracticePlanAction } from "../actions";

export const metadata = {
  title: "New practice plan",
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewPracticePlanPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });

  if (!team) {
    return (
      <div className="space-y-4">
        <Link href="/app/practice-planner" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Practice planner
        </Link>
        <p className="text-sm text-neutral-700">
          Practice plans use your team context. Set up{" "}
          <span className="font-medium text-neutral-900">Team</span> first, then drills, then return here.
        </p>
        <Link href="/app/team" className="text-sm font-semibold text-[#0b2340] underline-offset-4 hover:underline">
          Go to team setup
        </Link>
      </div>
    );
  }

  const drills = await loadDrillsForTeam(team.id, user.id);
  if (drills.length === 0) {
    return (
      <div className="space-y-4">
        <Link href="/app/practice-planner" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Practice planner
        </Link>
        <p className="text-sm text-neutral-700">
          Plans are built from your drill library. Add one or more drills, then start a plan—blocks always reference
          saved drills.
        </p>
        <Link href="/app/drills/new" className="text-sm font-semibold text-[#0b2340] underline-offset-4 hover:underline">
          Create a drill
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/practice-planner" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Practice planner
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">New practice plan</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Start with a title and optional details. On the next screen you will add drill blocks from your library.
        </p>
      </div>

      {error === "title" ? (
        <p className="text-sm text-red-700">Enter a valid title (required, max 200 characters).</p>
      ) : null}

      <form
        action={createPracticePlanAction}
        className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-800">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={200}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20"
          />
        </div>
        <div>
          <label htmlFor="practiceDate" className="block text-sm font-medium text-neutral-800">
            Practice date <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="practiceDate"
            name="practiceDate"
            type="date"
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20"
          />
        </div>
        <div>
          <label htmlFor="focus" className="block text-sm font-medium text-neutral-800">
            Focus <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="focus"
            name="focus"
            maxLength={2000}
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
            rows={3}
            maxLength={8000}
            className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-[#0b2340] focus:outline-none focus:ring-2 focus:ring-[#0b2340]/20"
          />
        </div>
        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055] sm:w-auto"
        >
          Continue to editor
        </button>
      </form>
    </div>
  );
}
