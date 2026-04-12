"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Matches billing redirects from server actions (e.g. checkout / portal guards). */
const BILLING_MESSAGES: Record<
  string,
  { title: string; body: string; borderClass: string; bgClass: string }
> = {
  "use-portal": {
    title: "Use billing to change your plan",
    body: "You already have subscription access in a billable state. Manage upgrades, payment method, or cancellation in the Billing Portal instead of starting a new checkout.",
    borderClass: "border-sky-200",
    bgClass: "bg-sky-50 text-sky-950",
  },
  "already-subscribed": {
    title: "Use billing to change your plan",
    body: "You already have an active subscription. Open the Billing Portal to change plan or payment details instead of starting a new checkout.",
    borderClass: "border-sky-200",
    bgClass: "bg-sky-50 text-sky-950",
  },
  misconfigured: {
    title: "Checkout is not available right now",
    body: "Billing could not start due to a configuration issue. Try again later or contact support if this continues.",
    borderClass: "border-amber-200",
    bgClass: "bg-amber-50 text-amber-950",
  },
  success: {
    title: "Checkout completed",
    body: "Stripe may take a moment to sync. Refresh the page if your plan or limits still look outdated.",
    borderClass: "border-emerald-200",
    bgClass: "bg-emerald-50 text-emerald-950",
  },
  canceled: {
    title: "Checkout canceled",
    body: "No payment was taken. You can start checkout again whenever you are ready.",
    borderClass: "border-neutral-200",
    bgClass: "bg-neutral-50 text-neutral-900",
  },
};

export function EntitlementUsageStrip() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const billing = searchParams.get("billing")?.trim() ?? "";
  const entry = billing ? BILLING_MESSAGES[billing] : undefined;

  if (!entry) {
    return null;
  }

  function dismiss() {
    router.replace(pathname);
  }

  return (
    <div
      role="status"
      className={`mb-6 rounded-xl border px-4 py-3 text-sm shadow-sm ${entry.borderClass} ${entry.bgClass}`}
    >
      <p className="font-semibold">{entry.title}</p>
      <p className="mt-1 leading-relaxed opacity-95">{entry.body}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg border border-black/10 bg-white/80 px-3 py-1.5 text-neutral-900 underline-offset-2 hover:underline"
        >
          Dismiss
        </button>
        <Link href="/app" className="rounded-lg px-3 py-1.5 text-[#0b2340] underline-offset-2 hover:underline">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
