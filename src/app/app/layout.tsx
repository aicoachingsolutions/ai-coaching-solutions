import Link from "next/link";
import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { EntitlementUsageStrip } from "./_components/entitlement-usage-strip";

export default async function CoachAppLayout({ children }: { children: React.ReactNode }) {
  await ensureAppUser();

  return (
    <div className="min-h-dvh bg-neutral-100 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="text-sm font-semibold text-[#0b2340] underline-offset-4 hover:underline"
            >
              Coach app
            </Link>
            <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
              <Link href="/app/team" className="text-neutral-700 hover:text-neutral-900">
                Team
              </Link>
              <Link href="/app/drills" className="text-neutral-700 hover:text-neutral-900">
                Drills
              </Link>
              <Link href="/app/practice-planner" className="text-neutral-700 hover:text-neutral-900">
                Practice planner
              </Link>
            </nav>
          </div>
          <UserButton />
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Suspense fallback={null}>
          <EntitlementUsageStrip />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
