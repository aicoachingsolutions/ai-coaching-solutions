import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { TeamForm } from "./team-form";

export const metadata = {
  title: "Team",
};

export default async function TeamPage() {
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          {team ? "Edit team" : "Create your team"}
        </h1>
        <p className="mt-2 text-sm text-neutral-700">
          One team per account for now. You can change these details anytime.
        </p>
      </div>
      <TeamForm
        initialName={team?.name ?? ""}
        initialSportCode={team?.sportCode ?? "BASKETBALL"}
        initialSeasonLabel={team?.seasonLabel ?? ""}
      />
    </div>
  );
}
