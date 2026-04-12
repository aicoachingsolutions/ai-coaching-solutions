import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { practicePlanItems, practicePlans } from "@/db/schema";

export type PracticePlanListRow = {
  id: string;
  title: string;
  practiceDate: Date | null;
  totalMinutes: number;
  itemCount: number;
  updatedAt: Date;
};

export async function loadPracticePlansList(teamId: string, userId: string): Promise<PracticePlanListRow[]> {
  const db = getDb();
  const plans = await db.query.practicePlans.findMany({
    where: and(eq(practicePlans.teamId, teamId), eq(practicePlans.userId, userId)),
    orderBy: [desc(practicePlans.updatedAt)],
    with: {
      items: true,
    },
  });

  return plans.map((p) => ({
    id: p.id,
    title: p.title,
    practiceDate: p.practiceDate ?? null,
    totalMinutes: p.items.reduce((sum, it) => sum + it.durationMinutes, 0),
    itemCount: p.items.length,
    updatedAt: p.updatedAt,
  }));
}

export type PracticePlanItemEditRow = {
  id: string;
  drillId: string;
  drillTitle: string;
  sortOrder: number;
  durationMinutes: number;
  notes: string | null;
};

export type PracticePlanForEdit = {
  id: string;
  title: string;
  practiceDate: Date | null;
  focus: string | null;
  notes: string | null;
  items: PracticePlanItemEditRow[];
};

export async function loadPracticePlanForEdit(
  planId: string,
  teamId: string,
  userId: string
): Promise<PracticePlanForEdit | null> {
  const db = getDb();
  const plan = await db.query.practicePlans.findFirst({
    where: and(eq(practicePlans.id, planId), eq(practicePlans.teamId, teamId), eq(practicePlans.userId, userId)),
    with: {
      items: {
        orderBy: [asc(practicePlanItems.sortOrder)],
        with: {
          drill: true,
        },
      },
    },
  });

  if (!plan) {
    return null;
  }

  return {
    id: plan.id,
    title: plan.title,
    practiceDate: plan.practiceDate ?? null,
    focus: plan.focus ?? null,
    notes: plan.notes ?? null,
    items: plan.items.map((it) => ({
      id: it.id,
      drillId: it.drillId,
      drillTitle: it.drill.title,
      sortOrder: it.sortOrder,
      durationMinutes: it.durationMinutes,
      notes: it.notes ?? null,
    })),
  };
}
