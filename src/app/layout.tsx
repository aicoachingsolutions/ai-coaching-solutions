import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aicoachingsolutions.net"),
  title: {
    default: "AI Coaching Solutions",
    template: "%s | AI Coaching Solutions",
  },
  description:
    "Coaching-first tools and resources built by a coach. Practical help for practice planning, player development, and simple AI-powered breakdowns.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "AI Coaching Solutions",
    description:
      "Coaching-first tools and resources built by a coach. Practical help for practice planning, player development, and simple AI-powered breakdowns.",
    url: "https://www.aicoachingsolutions.net",
    siteName: "AI Coaching Solutions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15 hover:text-white"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return <NavLink href={href}>{children}</NavLink>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-neutral-100 text-neutral-900 antialiased">
        <header
          className="sticky top-0 z-50 border-b text-white"
          style={{
            backgroundColor: "var(--navy, #0b1f3a)",
            borderColor: "var(--navy-2, #103055)",
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
            <Link href="/" className="group inline-flex shrink-0 items-center gap-1.5">
              <Image
                src="/ai-coaching-logo-v2.png"
                alt="AI Coaching Solutions logo"
                width={36}
                height={36}
                className="h-6 w-6 rounded-md border border-white/30 bg-white/10 object-cover"
                priority
              />
              <div className="grid grid-rows-2 leading-none">
                <span className="block text-sm font-semibold tracking-tight text-white sm:text-[15px]">
                  AI Coaching Solutions
                </span>
                <span className="mt-0.5 block text-[10px] font-medium tracking-[0.01em] text-white/80 sm:text-[11px]">
                  Built by a Coach
                </span>
              </div>
            </Link>

            <nav className="ml-auto flex flex-wrap items-center justify-end gap-1">
              <NavLink href="/blog">Resources</NavLink>
              <NavLink href="/tools">Tools</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <Link
                href="/free-breakdown"
                className="ml-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-neutral-100"
              >
                Try Free Breakdown
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}