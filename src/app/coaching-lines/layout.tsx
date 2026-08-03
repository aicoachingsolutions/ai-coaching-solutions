import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { BrandLogo } from "@/components/brand-logo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const marketingUrl =
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL || "https://www.aicoachingsolutions.net";

export const metadata: Metadata = {
  title: "The Lines Coaches Never Forget — Free PDF | Coach V",
  description:
    "101 things worth saying at practice — collected from 2,280 coaches, players, and parents. Free PDF download.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "The Lines Coaches Never Forget",
    description:
      "101 things worth saying at practice — from 2,280 coaches, players, and parents. Free PDF.",
    type: "website",
    images: [
      {
        url: "/images/the-lines-coaches-never-forget-cover.png",
        width: 540,
        height: 720,
        alt: "The Lines Coaches Never Forget",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lines Coaches Never Forget",
    description:
      "101 things worth saying at practice — from 2,280 coaches, players, and parents. Free PDF.",
    images: ["/images/the-lines-coaches-never-forget-cover.png"],
  },
};

export default function CoachingLinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} min-h-screen bg-[#071426] font-sans text-[#f8fafc]`}>
      <header className="border-b border-[rgba(148,163,184,0.18)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <BrandLogo context="header" />
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a] sm:block">
            Coach V · Building Better Coaches
          </p>
        </div>
      </header>
      <main className="w-full overflow-x-hidden">{children}</main>
      <footer className="border-t border-[rgba(148,163,184,0.18)] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
          <p>AI Coaching Solutions · Free coaching notes for coaches who care.</p>
          <div className="flex flex-wrap gap-4">
            <a href={marketingUrl} className="transition hover:text-[#f8fafc]">
              aicoachingsolutions.net
            </a>
            <Link href="/privacy-policy" className="transition hover:text-[#f8fafc]">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}
