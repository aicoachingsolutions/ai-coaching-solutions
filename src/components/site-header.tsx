import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const NAV_ITEMS = [
  { href: "/free-breakdown", label: "Free Analyzer" },
  { href: "/practice-planner", label: "Practice Planner" },
  { href: "/break90", label: "Break90" },
];

export function SiteHeader() {
  return (
    <header className="w-full border-b-2 border-[#ffd60a] bg-[#0b1f3a] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <BrandLogo context="header" />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 lg:hidden">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-none rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90 no-underline hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
