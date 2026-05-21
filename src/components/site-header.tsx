import Image from "next/image";
import Link from "next/link";
import { CoachAppNavLink } from "@/components/coach-app-nav-link";

const NAV_ITEMS = [
  { href: "/free-breakdown", label: "Free Analyzer" },
  { href: "/practice-planner", label: "Practice Planner" },
  { href: "/break90", label: "Break90" },
  { href: "/tools", label: "All Tools" },
];

export function SiteHeader() {
  return (
    <header className="w-full border-b-2 border-[#ffd60a] bg-[#0b1f3a] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/ai-coaching-logo-v2.png"
            alt="AI Coaching Solutions"
            width={40}
            height={40}
            className="rounded-md"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide text-white">
              AI Coaching Solutions
            </span>
            <span className="text-[11px] text-[#ffd60a]">Built by a Coach</span>
          </div>
        </Link>

        {/* Desktop Nav */}
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

          <div className="ml-2 border-l border-white/20 pl-2">
            <CoachAppNavLink />
          </div>
        </nav>
      </div>

      {/* Mobile Nav */}
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
          <div className="flex-none">
            <CoachAppNavLink />
          </div>
        </div>
      </div>
    </header>
  );
}
