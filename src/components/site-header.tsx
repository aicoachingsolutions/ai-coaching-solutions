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
    <header className="relative z-50 w-full bg-[#0b2340] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-2.5 overflow-hidden pr-2">
            <Link
              href="/"
              aria-label="Go to homepage"
              className="shrink-0 rounded-md no-underline"
            >
              <Image
                src="/ai-coaching-logo-v2.png"
                alt="AI Coaching Solutions logo"
                width={44}
                height={44}
                className="h-9 w-9 rounded-md border border-white/25 bg-white/10 object-cover"
                priority
              />
            </Link>
            <div className="flex min-w-0 flex-col justify-center">
              <p className="truncate text-sm font-semibold leading-tight tracking-tight text-white sm:text-[15px]">
                AI Coaching Solutions
              </p>
              <p className="mt-0.5 text-[11px] leading-none text-white/85">Built by a Coach</p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/30 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="text-lg leading-none">{isOpen ? "×" : "☰"}</span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-white no-underline visited:text-white hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/free-breakdown"
              className="ml-1 inline-flex h-9 items-center rounded-md border border-white/20 bg-white px-3 text-sm font-semibold text-slate-900 no-underline visited:text-slate-900 hover:bg-neutral-100"
            >
              Try Free Breakdown
            </Link>
          </nav>
        </div>
      </div>

      {isOpen ? (
        <div className="w-full border-t border-white/15 lg:hidden">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="grid gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-sm font-medium text-white no-underline visited:text-white hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/free-breakdown"
                onClick={() => setIsOpen(false)}
                className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 no-underline visited:text-slate-900 hover:bg-neutral-100"
              >
                Try Free Breakdown
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}