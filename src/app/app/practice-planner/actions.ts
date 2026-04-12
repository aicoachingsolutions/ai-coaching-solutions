"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { drills, practicePlanItems, practicePlans, teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { PRACTICE_PLAN_MAX_ITEMS } from "@/lib/practice-plan-limits";

export type PlanMutationResult = { ok: true } | { ok: false; error: string };

const planOwnership = (planId: string, teamId: string, userId: string) =>
  and(eq(practicePlans.id, planId), eq(practicePlans.teamId, teamId), eq(practicePlans.userId, userId));

async function requireTeamForUser() {
  const user = await ensureAppUser();
  const db = getDb();
  const team = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });
  return { user, team, db };
}

const itemSchema = z.object({
  drillId: z.string().uuid(),
  durationMinutes: z.number().int().min(1).max(180),
  notes: z.string().max(2000).optional().nullable(),
});

const planItemsArraySchema = z.array(itemSchema).max(PRACTICE_PLAN_MAX_ITEMS);

/** Create plan shell (metadata only); editor adds drill blocks. */
export async function createPracticePlanAction(formData: FormData) {
  const { user, team, db } = await requireTeamForUser();
  if (!team) {
    redirect("/app/team");
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title || title.length > 200) {
    redirect("/app/practice-planner/new?error=title");
  }

  const focusRaw = String(formData.get("focus") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();
  const focus = focusRaw ? focusRaw.slice(0, 2000) : null;
  const notes = notesRaw ? notesRaw.slice(0, 8000) : null;

  const practiceDateRaw = String(formData.get("practiceDate") ?? "").trim();
  let practiceDate: Date | null = null;
  if (practiceDateRaw) {
    const d = new Date(`${practiceDateRaw}T12:00:00.000Z`);
    if (!Number.isNaN(d.getTime())) {
      practiceDate = d;
    }
  }

  const [row] = await db
    .insert(practicePlans)
    .values({
      userId: user.id,
      teamId: team.id,
      title,
      practiceDate,
      focus,
      notes,
    })
    .returning({ id: practicePlans.id });

  revalidatePath("/app/practice-planner");
  redirect(`/app/practice-planner/${row.id}/edit`);
}

export async function savePracticePlanAction(formData: FormData): Promise<PlanMutationResult> {
  const { user, team, db } = await requireTeamForUser();
  if (!team) {
    return { ok: false, error: "Create your team first." };
  }

  const planId = String(formData.get("planId") ?? "").trim();
  if (!planId) {
    return { ok: false, error: "Missing plan." };
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title || title.length > 200) {
    return { ok: false, error: "Title is required (max 200 characters)." };
  }

  const focusRaw = String(formData.get("focus") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();
  const focus = focusRaw ? focusRaw.slice(0, 2000) : null;
  const notes = notesRaw ? notesRaw.slice(0, 8000) : null;

  const practiceDateRaw = String(formData.get("practiceDate") ?? "").trim();
  let practiceDate: Date | null = null;
  if (practiceDateRaw) {
    const d = new Date(`${practiceDateRaw}T12:00:00.000Z`);
    if (!Number.isNaN(d.getTime())) {
      practiceDate = d;
    }
  }

  const itemsJson = String(formData.get("itemsJson") ?? "").trim();
  let parsed: z.infer<typeof itemSchema>[];
  try {
    const raw = JSON.parse(itemsJson || "[]") as unknown;
    const itemsResult = planItemsArraySchema.safeParse(raw);
    if (!itemsResult.success) {
      const tooMany = itemsResult.error.issues.some((i) => i.code === "too_big");
      return {
        ok: false,
        error: tooMany
          ? `Too many drill blocks (maximum ${PRACTICE_PLAN_MAX_ITEMS}). Remove some blocks before saving.`
          : "Invalid drill list.",
      };
    }
    parsed = itemsResult.data;
  } catch {
    return { ok: false, error: "Invalid drill list." };
  }

  if (parsed.length === 0) {
    return {
      ok: false,
      error: "Add at least one drill block before saving. A practice plan needs at least one activity from your library.",
    };
  }

  const uniqueDrillIds = [...new Set(parsed.map((p) => p.drillId))];
  if (uniqueDrillIds.length > 0) {
    const okDrills = await db
      .select({ id: drills.id })
      .from(drills)
      .where(and(inArray(drills.id, uniqueDrillIds), eq(drills.teamId, team.id), eq(drills.userId, user.id)));
    if (okDrills.length !== uniqueDrillIds.length) {
      return { ok: false, error: "Every block must use a drill from your library." };
    }
  }

  try {
    await db.transaction(async (tx) => {
      const updated = await tx
        .update(practicePlans)
        .set({
          title,
          focus,
          notes,
          practiceDate,
          updatedAt: new Date(),
        })
        .where(planOwnership(planId, team.id, user.id))
        .returning({ id: practicePlans.id });

      if (updated.length === 0) {
        throw new Error("NOT_FOUND");
      }

      await tx.delete(practicePlanItems).where(eq(practicePlanItems.practicePlanId, planId));

      for (const [sortOrder, it] of parsed.entries()) {
        const noteVal =
          it.notes && String(it.notes).trim() ? String(it.notes).trim().slice(0, 2000) : null;
        await tx.insert(practicePlanItems).values({
          practicePlanId: planId,
          drillId: it.drillId,
          sortOrder,
          durationMinutes: it.durationMinutes,
          notes: noteVal,
        });
      }
    });
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return { ok: false, error: "Plan not found." };
    }
    return { ok: false, error: "Could not save practice plan." };
  }

  revalidatePath("/app/practice-planner");
  revalidatePath(`/app/practice-planner/${planId}/edit`);
  return { ok: true };
}

export async function deletePracticePlanAction(planId: string): Promise<PlanMutationResult> {
  const { user, team, db } = await requireTeamForUser();
  if (!team) {
    return { ok: false, error: "Create your team first." };
  }

  const removed = await db
    .delete(practicePlans)
    .where(planOwnership(planId, team.id, user.id))
    .returning({ id: practicePlans.id });

  if (removed.length === 0) {
    return { ok: false, error: "Plan not found." };
  }

  revalidatePath("/app/practice-planner");
  return { ok: true };
}
