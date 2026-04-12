"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const linkClass =
  "rounded-md px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white";

export function CoachAppNavLink() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <span className={`${linkClass} opacity-0`} aria-hidden>Sign in</span>;
  }

  if (isSignedIn) {
    return (
      <Link href="/app" className={linkClass}>
        Coach app
      </Link>
    );
  }

  return (
    <Link href="/sign-in" className={linkClass}>
      Sign in
    </Link>
  );
}
