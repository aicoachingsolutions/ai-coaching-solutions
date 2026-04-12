import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { loadDrillsForTeam } from "@/lib/drills";
import { loadPracticePlansList } from "@/lib/practice-plans";
import { DeletePlanButton } from "./delete-plan-button";

export const metadata = {
  title: "Practice planner",
};

function formatDate(d: Date | null) {
  if (!d) return null;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function PracticePlannerPage() {
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });

  if (!team) {
    return (
      <div className="space-y-4">
        <Link href="/app" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Back to dashboard
        </Link>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
          <p className="font-semibold">Set up your team first</p>
          <p className="mt-2 text-amber-900/90">
            Practice plans are tied to your team. Create the team, add drills, then build plans here.
          </p>
          <Link
            href="/app/team"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055]"
          >
            Go to team setup
          </Link>
        </div>
      </div>
    );
  }

  const drills = await loadDrillsForTeam(team.id, user.id);
  if (drills.length === 0) {
    return (
      <div className="space-y-4">
        <Link href="/app" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Back to dashboard
        </Link>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
          <p className="font-semibold">Add drills to your library first</p>
          <p className="mt-2 text-amber-900/90">
            Each practice block references a saved drill. Create a few drills, then return here to assemble a plan.
          </p>
          <Link
            href="/app/drills/new"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055]"
          >
            Create a drill
          </Link>
        </div>
      </div>
    );
  }

  const plans = await loadPracticePlansList(team.id, user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/app" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">Practice planner</h1>
          <p className="mt-2 text-sm text-neutral-700">Build plans from your drill library for {team.name}.</p>
        </div>
        <Link
          href="/app/practice-planner/new"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055]"
        >
          New plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-900">No practice plans yet</p>
          <p className="mt-2 text-sm text-neutral-700">Start with a title and optional focus, then add drill blocks.</p>
          <Link
            href="/app/practice-planner/new"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055]"
          >
            Create a plan
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {plans.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{p.title}</p>
                <p className="mt-1 text-sm text-neutral-600">
                  {p.itemCount} block{p.itemCount === 1 ? "" : "s"} · {p.totalMinutes} min total
                  {p.practiceDate ? ` · ${formatDate(p.practiceDate)}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/app/practice-planner/${p.id}/edit`}
                  className="text-sm font-semibold text-[#0b2340] underline-offset-4 hover:underline"
                >
                  Edit
                </Link>
                <DeletePlanButton planId={p.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
