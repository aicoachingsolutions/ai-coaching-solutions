"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/blog", label: "Resources" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 border-b text-white"
      style={{
        backgroundColor: "var(--navy, #0b1f3a)",
        borderColor: "var(--navy-2, #103055)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Link href="/" className="group inline-flex min-w-0 items-center gap-1.5">
            <Image
              src="/ai-coaching-logo-v2.png"
              alt="AI Coaching Solutions logo"
              width={36}
              height={36}
              className="h-6 w-6 rounded-md border border-white/30 bg-white/10 object-cover"
              priority
            />
            <div className="grid min-w-0 grid-rows-2 leading-none">
              <span className="block truncate text-sm font-semibold tracking-tight text-white sm:text-[14px] xl:text-[15px]">
                AI Coaching Solutions
              </span>
              <span className="mt-0.5 hidden truncate text-[10px] font-medium tracking-[0.01em] text-white/80 sm:block sm:text-[11px] lg:hidden xl:block">
                Built by a Coach
              </span>
            </div>
          </Link>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/30 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="text-lg leading-none">{isOpen ? "×" : "☰"}</span>
          </button>

          <nav className="ml-auto hidden min-w-0 flex-wrap items-center justify-end gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center justify-center rounded-md px-2 py-2 text-xs font-medium text-white/90 no-underline transition hover:bg-white/10 hover:opacity-90"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/free-breakdown"
              className="ml-1 inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white px-2.5 text-xs font-semibold text-slate-900 no-underline transition hover:bg-neutral-100"
            >
              Try Free Breakdown
            </Link>
          </nav>
        </div>

        {isOpen && (
          <nav className="mt-3 space-y-2 border-t border-white/20 pt-3 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-sm font-medium text-white no-underline transition hover:bg-white/10 hover:opacity-90"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/free-breakdown"
              onClick={() => setIsOpen(false)}
              className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 no-underline transition hover:bg-neutral-100"
            >
              Try Free Breakdown
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
