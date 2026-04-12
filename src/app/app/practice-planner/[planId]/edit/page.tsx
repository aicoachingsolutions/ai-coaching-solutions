import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { loadDrillsForTeam } from "@/lib/drills";
import { loadPracticePlanForEdit } from "@/lib/practice-plans";
import { PracticePlanEditor } from "../../practice-plan-editor";

export const metadata = {
  title: "Edit practice plan",
};

type Props = { params: Promise<{ planId: string }> };

function dateInputValue(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

export default async function EditPracticePlanPage({ params }: Props) {
  const { planId } = await params;
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });

  if (!team) {
    notFound();
  }

  const drills = await loadDrillsForTeam(team.id, user.id);
  if (drills.length === 0) {
    return (
      <div className="space-y-4">
        <Link href="/app/practice-planner" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Practice planner
        </Link>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
          <p className="font-semibold">Add drills first</p>
          <p className="mt-2 text-amber-900/90">You need at least one drill in your library to edit this plan.</p>
          <Link
            href="/app/drills/new"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b2340] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#103055]"
          >
            New drill
          </Link>
        </div>
      </div>
    );
  }

  const plan = await loadPracticePlanForEdit(planId, team.id, user.id);
  if (!plan) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/practice-planner" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Practice planner
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">Edit plan</h1>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <PracticePlanEditor
          planId={plan.id}
          initialTitle={plan.title}
          initialFocus={plan.focus ?? ""}
          initialNotes={plan.notes ?? ""}
          initialPracticeDate={dateInputValue(plan.practiceDate)}
          drills={drills.map((d) => ({ id: d.id, title: d.title }))}
          initialItems={plan.items.map((it) => ({
            drillId: it.drillId,
            durationMinutes: it.durationMinutes,
            notes: it.notes ?? "",
          }))}
        />
      </div>
    </div>
  );
}
