import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} font-sans`}>
      <SiteHeader />
      <main className="w-full overflow-x-hidden">{children}</main>
      <Footer />
      <Analytics />
    </div>
  );
}
