import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { marketingContainer } from "@/lib/marketing-buttons";

const CONTACT_EMAIL = "coach@aicoachingsolutions.net";

export const metadata = {
  title: "Contact | AI Coaching Solutions",
  description:
    "Questions, feedback, or MVP program requests — reach coach@aicoachingsolutions.net or send a message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="bg-[#071426] text-[#f8fafc]">
      <section className="border-b border-[rgba(148,163,184,0.18)] bg-[#0b1f3a] pt-24 pb-10 sm:pb-12">
        <div className={marketingContainer}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#ffd60a]">
            Contact
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[#e2e8f0] sm:text-lg">
            Questions about Practice Planner, Break90, the Free Swing Analyzer, or founding
            programs — send a message or email us directly.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className={marketingContainer}>
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            <aside className="lg:col-span-2">
              <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(11,31,58,0.65)] p-6 sm:p-7">
                <h2 className="text-lg font-bold text-[#f8fafc]">Email us</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#e2e8f0]">
                  Prefer email? We read every message.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-4 inline-block text-lg font-semibold text-[#ffd60a] no-underline hover:text-[#ffe566]"
                >
                  {CONTACT_EMAIL}
                </a>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd60a]">
                    Good for
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-[#f8fafc]/90">
                    <li className="flex gap-2">
                      <span className="text-[#ffd60a]">→</span>
                      Practice Planner or Break90 MVP / waitlist questions
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#ffd60a]">→</span>
                      Free Swing Analyzer feedback
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#ffd60a]">→</span>
                      Bugs, access issues, or partnership ideas
                    </li>
                  </ul>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd60a]">
                    Quick links
                  </h3>
                  <nav className="mt-3 flex flex-col gap-2 text-sm">
                    <Link
                      href="/"
                      className="text-[#e2e8f0] no-underline hover:text-[#f8fafc]"
                    >
                      All tools
                    </Link>
                    <Link
                      href="/free-breakdown"
                      className="text-[#e2e8f0] no-underline hover:text-[#f8fafc]"
                    >
                      Free Swing Analyzer
                    </Link>
                    <Link
                      href="/practice-planner"
                      className="text-[#e2e8f0] no-underline hover:text-[#f8fafc]"
                    >
                      Practice Planner MVP
                    </Link>
                    <Link
                      href="/break90"
                      className="text-[#e2e8f0] no-underline hover:text-[#f8fafc]"
                    >
                      Break90 Golf MVP
                    </Link>
                  </nav>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
