import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { drills, teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { DrillForm } from "../../drill-form";

export const metadata = {
  title: "Edit drill",
};

type Props = { params: Promise<{ drillId: string }> };

export default async function EditDrillPage({ params }: Props) {
  const { drillId } = await params;
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });
  if (!team) {
    notFound();
  }

  const drill = await db.query.drills.findFirst({
    where: and(eq(drills.id, drillId), eq(drills.teamId, team.id), eq(drills.userId, user.id)),
  });

  if (!drill) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/drills" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Drills
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">Edit drill</h1>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <DrillForm drillId={drill.id} initialTitle={drill.title} initialNotes={drill.notes ?? ""} />
      </div>
    </div>
  );
}
