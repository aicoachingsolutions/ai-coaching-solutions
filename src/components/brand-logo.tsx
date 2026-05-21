import Image from "next/image";
import Link from "next/link";

/** Circle crest — matches WordPress theme `coach-v-circle-logo.png` */
export const BRAND_CREST_SRC = "/images/coach-v-circle-logo.png";

export const BRAND_NAME = "AI Coaching Solutions";

type BrandLogoProps = {
  context?: "header" | "footer";
  className?: string;
};

export function BrandLogo({ context = "header", className = "" }: BrandLogoProps) {
  const isFooter = context === "footer";

  return (
    <Link
      href="/"
      className={`inline-flex leading-snug no-underline ${
        isFooter
          ? "flex-col items-start gap-2.5"
          : "flex-row items-center gap-3"
      } ${className}`}
      aria-label={`${BRAND_NAME} — Home`}
    >
      <span
        className={`flex shrink-0 items-center overflow-visible ${
          isFooter ? "pb-3" : "pb-2.5"
        }`}
      >
        <Image
          src={BRAND_CREST_SRC}
          alt=""
          width={isFooter ? 128 : 112}
          height={isFooter ? 64 : 52}
          className={`block h-auto w-auto object-contain object-bottom ${
            isFooter ? "max-h-16" : "max-h-[52px] md:max-h-14"
          }`}
          priority={context === "header"}
        />
      </span>
      <span
        className={`font-bold uppercase tracking-[0.12em] text-[#ffd60a] ${
          isFooter
            ? "max-w-[12rem] text-xs leading-[1.35]"
            : "max-w-[11rem] text-[11px] leading-[1.35] md:max-w-none md:whitespace-nowrap md:text-xs"
        }`}
      >
        {BRAND_NAME}
      </span>
    </Link>
  );
}
