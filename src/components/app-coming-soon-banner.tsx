import { FreeBreakdownTrackedLink } from "@/components/free-breakdown-tracked-link";
import { btnPrimary, marketingContainer } from "@/lib/marketing-buttons";

export function AppComingSoonBanner() {
  return (
    <section
      aria-label="Coming soon announcement"
      className="border-b border-[rgba(255,214,10,0.35)] bg-gradient-to-b from-[#0b1f3a] to-[#071426] pt-6"
    >
      <div className={marketingContainer}>
        <div className="flex flex-col gap-4 rounded-xl border border-[rgba(255,214,10,0.28)] bg-[rgba(255,214,10,0.06)] px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-5 md:py-5">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#ffd60a]">
              Coming soon
            </p>
            <p className="text-lg font-bold leading-snug text-[#f8fafc] sm:text-xl">
              New website experience launching soon
            </p>
            <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-[#e2e8f0]">
              Practice Planner and Break90 founding programs are opening here —{" "}
              <strong className="font-semibold text-[#f8fafc]/90">60 days of Pro free</strong> for
              founding coaches and golfers. Free Swing Analyzer is live now.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <FreeBreakdownTrackedLink location="coming_soon_banner" className={btnPrimary}>
              Try Free Swing Analyzer
            </FreeBreakdownTrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
