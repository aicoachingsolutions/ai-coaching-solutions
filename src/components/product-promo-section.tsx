import Link from "next/link";
import type { ReactNode } from "react";

type ProductPromoSectionProps = {
  badge: string;
  badgeTone?: "neutral" | "orange";
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoMaxWidthClassName?: string;
  title: string;
  description: string;
  offerTitle: string;
  offerBody: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaAriaLabel: string;
  ctaExternal?: boolean;
  note: string;
  className?: string;
  children?: ReactNode;
};

const promoPrimaryLinkClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-950/20 transition-colors transition-shadow duration-200 hover:bg-orange-800 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-200 sm:w-auto";

export function ProductPromoSection({
  badge,
  badgeTone = "neutral",
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  logoMaxWidthClassName = "max-w-[280px]",
  title,
  description,
  offerTitle,
  offerBody,
  bullets,
  ctaLabel,
  ctaHref,
  ctaAriaLabel,
  ctaExternal = false,
  note,
  className = "",
  children,
}: ProductPromoSectionProps) {
  const badgeClassName =
    badgeTone === "orange"
      ? "border-orange-200/90 bg-orange-50 text-orange-900"
      : "border-slate-300/90 bg-slate-100 text-slate-800";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-sm sm:p-10 lg:p-12 ${className}`}
    >
      <span
        className={`absolute right-4 top-4 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] shadow-sm sm:right-6 sm:top-6 ${badgeClassName}`}
      >
        {badge}
      </span>

      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="flex justify-center lg:col-span-4 lg:justify-start">
          {/* Use native img so /public PNG and SVG both work without next/image SVG restrictions */}
          <img
            src={logoSrc}
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className={`h-auto w-full object-contain drop-shadow-sm ${logoMaxWidthClassName}`}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="min-w-0 lg:col-span-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">{description}</p>

          <div className="mt-6 rounded-2xl border border-orange-200/80 bg-orange-50/80 p-5 shadow-sm sm:p-6">
            <p className="text-lg font-semibold text-neutral-900">{offerTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-800">{offerBody}</p>
          </div>

          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-800 sm:text-base">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>

          {children ? <div className="mt-6">{children}</div> : null}

          <div className="mt-8">
            {ctaExternal ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ctaAriaLabel}
                className={promoPrimaryLinkClassName}
              >
                {ctaLabel}
              </a>
            ) : (
              <Link href={ctaHref} aria-label={ctaAriaLabel} className={promoPrimaryLinkClassName}>
                {ctaLabel}
              </Link>
            )}
            <p className="mt-3 text-xs text-neutral-600 sm:text-sm">{note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
