import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/blog", label: "Resources" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="w-full bg-[#0b2340] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/ai-coaching-logo-v2.png"
            alt="AI Coaching Solutions"
            width={44}
            height={44}
            className="rounded-md border border-white/25 bg-white/10"
            priority
          />

          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-white">
              AI Coaching Solutions
            </span>
            <span className="text-xs text-white/70">
              Built by a Coach
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/free-breakdown"
            className="ml-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0b2340] transition hover:bg-neutral-100"
          >
            Try Free Breakdown
          </Link>
        </nav>
      </div>

      {/* Mobile Nav */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 border-t border-white/15 px-4 py-3 lg:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white no-underline visited:text-white hover:text-white"
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/free-breakdown"
          className="col-span-2 flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0b2340]"
        >
          Try Free Breakdown
        </Link>
      </div>
    </header>
  );
}