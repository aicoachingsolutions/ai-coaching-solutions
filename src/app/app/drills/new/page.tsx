import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { DrillForm } from "../drill-form";

export const metadata = {
  title: "New drill",
};

export default async function NewDrillPage() {
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });

  if (!team) {
    return (
      <div className="space-y-4">
        <Link href="/app/drills" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Drills
        </Link>
        <p className="text-sm text-neutral-700">Create your team before adding drills.</p>
        <Link href="/app/team" className="text-sm font-semibold text-[#0b2340] underline-offset-4 hover:underline">
          Team setup
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/drills" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Drills
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">New drill</h1>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <DrillForm initialTitle="" initialNotes="" />
      </div>
    </div>
  );
}
