import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { sportLabel } from "@/lib/sport-codes";

export default async function AppDashboardPage() {
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });

  if (!team) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Welcome</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          Create your team to get started. You can set the team name, sport, and an optional season
          label.
        </p>
        <Link
          href="/app/team"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0b2340] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#103055]"
        >
          Create your team
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Dashboard</h1>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">How the coach app fits together</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          Work in this order: set your team, build your drill library, then assemble practice plans from those drills.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-neutral-800">
          <li>
            <Link href="/app/team" className="font-semibold text-[#0b2340] underline-offset-4 hover:underline">
              Team
            </Link>
            <span className="text-neutral-600"> — name, sport, season label</span>
          </li>
          <li>
            <Link href="/app/drills" className="font-semibold text-[#0b2340] underline-offset-4 hover:underline">
              Drills
            </Link>
            <span className="text-neutral-600"> — reusable blocks for practices</span>
          </li>
          <li>
            <Link href="/app/practice-planner" className="font-semibold text-[#0b2340] underline-offset-4 hover:underline">
              Practice planner
            </Link>
            <span className="text-neutral-600"> — plans built from your library</span>
          </li>
        </ol>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Your team</h2>
        <p className="mt-2 text-xl font-semibold text-neutral-900">{team.name}</p>
        <dl className="mt-4 space-y-2 text-sm text-neutral-800">
          <div className="flex gap-2">
            <dt className="font-medium text-neutral-600">Sport</dt>
            <dd>{sportLabel(team.sportCode)}</dd>
          </div>
          {team.seasonLabel ? (
            <div className="flex gap-2">
              <dt className="font-medium text-neutral-600">Season</dt>
              <dd>{team.seasonLabel}</dd>
            </div>
          ) : null}
        </dl>
        <Link
          href="/app/team"
          className="mt-6 inline-flex text-sm font-semibold text-[#0b2340] underline-offset-4 hover:underline"
        >
          Edit team
        </Link>
      </div>
    </div>
  );
}
