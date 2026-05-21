import Link from "next/link";
import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import { BrandLogo } from "@/components/brand-logo";
import { ensureAppUser } from "@/lib/ensureAppUser";
import { EntitlementUsageStrip } from "./_components/entitlement-usage-strip";

export default async function CoachAppLayout({ children }: { children: React.ReactNode }) {
  await ensureAppUser();

  return (
    <div className="min-h-dvh bg-neutral-100 text-neutral-900">
      <header className="border-b-2 border-[#ffd60a] bg-[#0b1f3a] text-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 sm:gap-6">
            <BrandLogo context="header" className="shrink-0" />
            <nav className="flex flex-wrap gap-x-3 gap-y-1 border-l border-white/20 pl-4 text-sm">
              <Link href="/app" className="font-semibold text-white/90 hover:text-white">
                Coach app
              </Link>
              <Link href="/app/team" className="text-white/75 hover:text-white">
                Team
              </Link>
              <Link href="/app/drills" className="text-white/75 hover:text-white">
                Drills
              </Link>
              <Link
                href="/app/practice-planner"
                className="text-white/75 hover:text-white"
              >
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
