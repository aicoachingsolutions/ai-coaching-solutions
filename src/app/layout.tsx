import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
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
  verification: {
    google: "google8094f2ec92f6f1b8",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-x-clip">
      <body className="min-h-dvh w-full overflow-x-clip bg-neutral-100 text-neutral-900 antialiased">
        <SiteHeader />

        <main className="w-full overflow-x-hidden py-8 sm:py-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}