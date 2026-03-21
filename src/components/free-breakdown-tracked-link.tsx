"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

type Props = {
  location: string;
  className?: string;
  children: React.ReactNode;
};

export function FreeBreakdownTrackedLink({ location, className, children }: Props) {
  return (
    <Link
      href="/free-breakdown"
      className={className}
      onClick={() =>
        track("Free Swing Breakdown Clicked", {
          location,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        })
      }
    >
      {children}
    </Link>
  );
}
