import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

// Same font as the main marketing site so the analyzer matches brand.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function FreeBreakdownLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} font-sans`}>
      <main className="w-full overflow-x-hidden">{children}</main>
      <Footer />
      <Analytics />
    </div>
  );
}
