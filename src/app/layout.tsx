import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";

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
  verification: {
    google: "google8094f2ec92f6f1b8",
  },
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15 hover:text-white md:w-auto"
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
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-3 py-3 sm:px-4 md:flex-row md:items-center md:justify-between md:py-2.5">
            <Link
              href="/"
              className="group inline-flex w-full items-center justify-center gap-1.5 md:w-auto md:shrink-0 md:justify-start"
            >
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

            <nav className="grid w-full grid-cols-2 gap-1.5 md:ml-auto md:flex md:w-auto md:flex-nowrap md:items-center md:justify-end md:gap-1">
              <NavLink href="/blog">Resources</NavLink>
              <NavLink href="/tools">Tools</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <Link
                href="/free-breakdown"
                className="col-span-2 mt-1 inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-neutral-100 md:ml-2 md:mt-0"
              >
                Try Free Breakdown
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}