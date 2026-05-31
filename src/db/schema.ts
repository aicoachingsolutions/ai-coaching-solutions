/**
 * Central data layer for the Coach Pro suite (Practice Planner, Team Builder,
 * Team Analyzer, Swing Analysis, Communication/Culture).
 *
 * ⚠️ ROADMAP ACTION — see docs/platform-roadmap.md (§2 "The Spine", §4 "Build Sequence"):
 *   The Practice Planner MVP should START the central stats layer HERE, so the
 *   future Team Analyzer can read cross-app data without a painful migration.
 *     • Add athlete + stat records hung off the coach profile (appUsers).
 *     • Design them in a SHARED shape other apps can query — not a
 *       Practice-Planner-only structure.
 *
 * ⚠️ MULTI-TEAM CONSTRAINT — `teams.userId` is currently `.unique()`, i.e. ONE
 *   team per coach (fine for free/MVP). Coach Pro requires MULTIPLE teams per
 *   coach; this constraint must be removed before Team Builder / Pro ships.
 *
 * Note: app data lives in Neon (DATABASE_URL via Drizzle). Supabase is used only
 * for breakdown rate-limiting (api_requests). Any `team_stat_*` tables seen in
 * the shared Supabase project are NOT wired to this app — decide the single
 * central store before building Team Analyzer.
 */
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const appUsers = pgTable("app_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" })
    .unique(),
  name: text("name").notNull(),
  sportCode: text("sport_code").notNull(),
  seasonLabel: text("season_label"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const drills = pgTable("drills", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" }),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const practicePlans = pgTable("practice_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" }),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  practiceDate: timestamp("practice_date", { withTimezone: true }),
  focus: text("focus"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const practicePlanItems = pgTable("practice_plan_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  practicePlanId: uuid("practice_plan_id")
    .notNull()
    .references(() => practicePlans.id, { onDelete: "cascade" }),
  drillId: uuid("drill_id")
    .notNull()
    .references(() => drills.id, { onDelete: "restrict" }),
  sortOrder: integer("sort_order").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  notes: text("notes"),
});

export const appUsersRelations = relations(appUsers, ({ one, many }) => ({
  team: one(teams, {
    fields: [appUsers.id],
    references: [teams.userId],
  }),
  drills: many(drills),
  practicePlans: many(practicePlans),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  user: one(appUsers, {
    fields: [teams.userId],
    references: [appUsers.id],
  }),
  drills: many(drills),
  practicePlans: many(practicePlans),
}));

export const drillsRelations = relations(drills, ({ one, many }) => ({
  user: one(appUsers, {
    fields: [drills.userId],
    references: [appUsers.id],
  }),
  team: one(teams, {
    fields: [drills.teamId],
    references: [teams.id],
  }),
  planItems: many(practicePlanItems),
}));

export const practicePlansRelations = relations(practicePlans, ({ one, many }) => ({
  user: one(appUsers, {
    fields: [practicePlans.userId],
    references: [appUsers.id],
  }),
  team: one(teams, {
    fields: [practicePlans.teamId],
    references: [teams.id],
  }),
  items: many(practicePlanItems),
}));

export const practicePlanItemsRelations = relations(practicePlanItems, ({ one }) => ({
  plan: one(practicePlans, {
    fields: [practicePlanItems.practicePlanId],
    references: [practicePlans.id],
  }),
  drill: one(drills, {
    fields: [practicePlanItems.drillId],
    references: [drills.id],
  }),
}));
