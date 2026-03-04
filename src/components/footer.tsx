import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              AI Coaching Solutions
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Built by a coach. Designed for practical use.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
            <Link href="/about" className="hover:text-neutral-900">
              About
            </Link>
            <Link href="/howitworks" className="hover:text-neutral-900">
              How It Works
            </Link>
            <Link href="/contact" className="hover:text-neutral-900">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-neutral-900">
              Privacy
            </Link>
            <Link href="/terms-conditions" className="hover:text-neutral-900">
              Terms
            </Link>
            <Link href="/refund-policy" className="hover:text-neutral-900">
              Refund
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
