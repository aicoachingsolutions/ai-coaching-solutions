import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Analytics } from "@vercel/analytics/next";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="w-full overflow-x-hidden">{children}</main>
      <Footer />
      <Analytics />
    </>
  );
}
