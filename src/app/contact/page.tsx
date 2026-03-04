import { PageShell, Prose, Callout } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact | AI Coaching Solutions",
  description:
    "Questions, feedback, or coaching tool requests—reach out. Built by a coach, and I actually read messages.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Reach out"
      subtitle="If you have a question, an idea, or want to tell me what would make the free breakdown more useful—send a note."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: contact info */}
        <div className="lg:col-span-1">
          <Prose>
            <p className="text-neutral-800">
              I built this for real coaches. If something is confusing, if you
              have an improvement idea, or if you want a resource added—send it.
            </p>

            <Callout title="Email">
              <p className="text-sm text-neutral-800">
                <a
                  className="font-medium underline underline-offset-4 hover:text-neutral-900"
                  href="mailto:info@aicoachingsolutions.net"
                >
                  info@aicoachingsolutions.net
                </a>
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Best for: questions, feedback, or partnership requests.
              </p>
            </Callout>

            <Callout title="Social">
              <p className="text-sm text-neutral-600">
                If you found me on TikTok or YouTube, you can message there too.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700">
                  YouTube
                </span>
                <span className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700">
                  TikTok
                </span>
                <span className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700">
                  Instagram
                </span>
                <span className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700">
                  Facebook
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Social profile links can be added here anytime.
              </p>
            </Callout>
          </Prose>
        </div>

        {/* Right: contact form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </PageShell>
  );
}
