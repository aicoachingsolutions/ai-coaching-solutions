import Link from "next/link";
import { BrandLogo, BRAND_NAME } from "@/components/brand-logo";

const toolLinks = [
  { href: "/free-breakdown", label: "Free Swing Analyzer" },
  { href: "/practice-planner", label: "Practice Planner" },
  { href: "/break90", label: "Break90 Golf" },
  { href: "/tools", label: "All Tools" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-conditions", label: "Terms" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-[#ffd60a] bg-[#0b1f3a] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto_auto] sm:items-start">
          <div className="space-y-3">
            <BrandLogo context="footer" />
            <p className="text-sm text-white/65">Built by a coach. Designed for practical use.</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#ffd60a]">Tools</p>
            <nav className="flex flex-col gap-2">
              {toolLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/75 no-underline transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#ffd60a]">Legal</p>
            <nav className="flex flex-col gap-2">
              {legalLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/75 no-underline transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-6">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
