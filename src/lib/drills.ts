import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { drills } from "@/db/schema";

export async function loadDrillsForTeam(teamId: string, userId: string) {
  const db = getDb();
  return db.query.drills.findMany({
    where: and(eq(drills.teamId, teamId), eq(drills.userId, userId)),
    orderBy: [asc(drills.title)],
  });
}
