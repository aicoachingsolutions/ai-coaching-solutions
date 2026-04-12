import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { loadDrillsForTeam } from "@/lib/drills";

export const metadata = {
  title: "Drills",
};

export default async function DrillsPage() {
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
            Create your team, then you can save drills and build practice plans from them.
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

  const list = await loadDrillsForTeam(team.id, user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/app" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">Drill library</h1>
          <p className="mt-2 text-sm text-neutral-700">Saved drills for {team.name}. Use them in the practice planner.</p>
        </div>
        <Link
          href="/app/drills/new"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055]"
        >
          New drill
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-900">No drills yet</p>
          <p className="mt-2 text-sm text-neutral-700">
            Add at least one drill so you can drop it into a practice plan.
          </p>
          <Link
            href="/app/drills/new"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055]"
          >
            Create your first drill
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {list.map((d) => (
            <li key={d.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{d.title}</p>
                {d.notes ? <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{d.notes}</p> : null}
              </div>
              <Link
                href={`/app/drills/${d.id}/edit`}
                className="shrink-0 text-sm font-semibold text-[#0b2340] underline-offset-4 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
