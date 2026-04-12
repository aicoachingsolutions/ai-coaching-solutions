"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { teams } from "@/db/schema";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { isSportCode } from "@/lib/sport-codes";

export type SaveTeamResult = { ok: true } | { ok: false; error: string };

export async function saveTeamAction(formData: FormData): Promise<SaveTeamResult> {
  const user = await ensureAppUser();

  const name = String(formData.get("name") ?? "").trim();
  const sportCode = String(formData.get("sportCode") ?? "").trim();
  const seasonLabelRaw = String(formData.get("seasonLabel") ?? "").trim();
  const seasonLabel = seasonLabelRaw ? seasonLabelRaw.slice(0, 120) : null;

  if (!name || name.length > 120) {
    return { ok: false, error: "Team name is required (max 120 characters)." };
  }
  if (!isSportCode(sportCode)) {
    return { ok: false, error: "Choose a sport from the list." };
  }

  const db = getDb();
  const existing = await db.query.teams.findFirst({
    where: eq(teams.userId, user.id),
  });

  if (existing) {
    await db
      .update(teams)
      .set({
        name,
        sportCode,
        seasonLabel,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, existing.id));
  } else {
    await db.insert(teams).values({
      userId: user.id,
      name,
      sportCode,
      seasonLabel,
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/team");
  return { ok: true };
}
