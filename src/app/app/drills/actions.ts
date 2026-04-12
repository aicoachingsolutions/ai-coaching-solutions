"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { drills, teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";

export type DrillMutationResult = { ok: true } | { ok: false; error: string };

const drillOwnership = (drillId: string, teamId: string, userId: string) =>
  and(eq(drills.id, drillId), eq(drills.teamId, teamId), eq(drills.userId, userId));

async function requireTeam() {
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });
  return { user, team, db };
}

export async function saveDrillAction(formData: FormData): Promise<DrillMutationResult> {
  const { user, team, db } = await requireTeam();
  if (!team) {
    return { ok: false, error: "Create your team first." };
  }

  const drillId = String(formData.get("drillId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();
  const notes = notesRaw ? notesRaw.slice(0, 8000) : null;

  if (!title || title.length > 200) {
    return { ok: false, error: "Title is required (max 200 characters)." };
  }

  if (drillId) {
    const updated = await db
      .update(drills)
      .set({
        title,
        notes,
        updatedAt: new Date(),
      })
      .where(drillOwnership(drillId, team.id, user.id))
      .returning({ id: drills.id });

    if (updated.length === 0) {
      return { ok: false, error: "Drill not found." };
    }
  } else {
    await db.insert(drills).values({
      userId: user.id,
      teamId: team.id,
      title,
      notes,
    });
  }

  revalidatePath("/app/drills");
  return { ok: true };
}

export async function deleteDrillAction(drillId: string): Promise<DrillMutationResult> {
  const { user, team, db } = await requireTeam();
  if (!team) {
    return { ok: false, error: "Create your team first." };
  }

  try {
    const removed = await db
      .delete(drills)
      .where(drillOwnership(drillId, team.id, user.id))
      .returning({ id: drills.id });

    if (removed.length === 0) {
      return { ok: false, error: "Drill not found." };
    }
  } catch {
    return {
      ok: false,
      error: "This drill is still on a practice plan. Remove it from those plans first.",
    };
  }

  revalidatePath("/app/drills");
  return { ok: true };
}
