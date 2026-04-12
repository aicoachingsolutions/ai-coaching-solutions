import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { appUsers } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type AppUser = InferSelectModel<typeof appUsers>;

/**
 * Canonical entry for authenticated /app code: ensures a row exists in app_users
 * for the current Clerk session. No webhooks — upsert path only.
 * Redirects to sign-in when there is no session.
 */
export async function ensureAppUser(): Promise<AppUser> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const db = getDb();

  const existing = await db.query.appUsers.findFirst({
    where: eq(appUsers.clerkUserId, userId),
  });
  if (existing) {
    return existing;
  }

  let email = "";
  let displayName: string | null = null;

  const clerkUser = await currentUser();
  if (clerkUser) {
    const primaryEmail = clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress;
    const fallbackEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
    email = (primaryEmail ?? fallbackEmail ?? "").trim();
    if (clerkUser.firstName || clerkUser.lastName) {
      displayName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() || null;
    }
    if (!displayName && clerkUser.username) {
      displayName = clerkUser.username;
    }
  } else {
    try {
      const api = await clerkClient();
      const user = await api.users.getUser(userId);
      const primary =
        user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
        user.emailAddresses?.[0]?.emailAddress ??
        "";
      email = primary.trim();
      if (user.firstName || user.lastName) {
        displayName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || null;
      }
      if (!displayName && user.username) {
        displayName = user.username;
      }
    } catch {
      /* OAuth race: session exists before request-scoped user is hydrated */
    }
  }

  const finalEmail = email || "unknown@user.local";

  await db
    .insert(appUsers)
    .values({
      clerkUserId: userId,
      email: finalEmail,
      displayName,
    })
    .onConflictDoNothing({ target: appUsers.clerkUserId });

  const created = await db.query.appUsers.findFirst({
    where: eq(appUsers.clerkUserId, userId),
  });

  if (!created) {
    throw new Error("Failed to create or load app user");
  }

  return created;
}
