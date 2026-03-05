import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              AI Coaching Solutions
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Built by a coach. Designed for practical use.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-600 sm:ml-auto sm:flex-1 sm:justify-end">
            <Link href="/about" className="rounded-md px-2 py-1 no-underline transition hover:bg-neutral-100 hover:text-neutral-900 hover:opacity-90">
              About
            </Link>
            <Link href="/howitworks" className="rounded-md px-2 py-1 no-underline transition hover:bg-neutral-100 hover:text-neutral-900 hover:opacity-90">
              How It Works
            </Link>
            <Link href="/contact" className="rounded-md px-2 py-1 no-underline transition hover:bg-neutral-100 hover:text-neutral-900 hover:opacity-90">
              Contact
            </Link>
            <Link href="/privacy-policy" className="rounded-md px-2 py-1 no-underline transition hover:bg-neutral-100 hover:text-neutral-900 hover:opacity-90">
              Privacy
            </Link>
            <Link href="/terms-conditions" className="rounded-md px-2 py-1 no-underline transition hover:bg-neutral-100 hover:text-neutral-900 hover:opacity-90">
              Terms
            </Link>
            <Link href="/refund-policy" className="rounded-md px-2 py-1 no-underline transition hover:bg-neutral-100 hover:text-neutral-900 hover:opacity-90">
              Refund Policy
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} AI Coaching Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
