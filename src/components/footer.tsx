import Link from "next/link";

export function Footer() {
  const links = [
    { href: "/about", label: "About" },
    { href: "/howitworks", label: "How It Works" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/terms-conditions", label: "Terms" },
    { href: "/refund-policy", label: "Refund Policy" },
  ];

  return (
    <footer className="mt-16 w-full bg-[#0b2340] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">AI Coaching Solutions</p>
            <p className="text-sm text-white/90">Built by a coach. Designed for practical use.</p>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:justify-items-end">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-9 items-center rounded-md px-2 py-1 text-sm text-white no-underline visited:text-white hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-white/15 pt-6">
          <p className="text-xs text-white/80">
            © {new Date().getFullYear()} AI Coaching Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
