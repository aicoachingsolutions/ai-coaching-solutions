import { PageShell, Prose } from "@/components/page-shell";

export const metadata = {
  title: "Refund Policy | AI Coaching Solutions",
  description:
    "Refund policy for digital products and future paid services offered by AI Coaching Solutions.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <PageShell
      eyebrow="Refund Policy"
      title="Refund Policy"
      subtitle="Last updated: March 2026"
    >
      <Prose>
        <p>
          AI Coaching Solutions currently provides free coaching tools.
          If paid services or digital products are introduced in the future,
          this policy will govern refund eligibility.
        </p>

        <h2 className="font-semibold">Digital Products</h2>
        <p>
          Due to the nature of digital content and instant access delivery,
          refunds may be limited once access has been granted.
        </p>

        <p>
          Refund requests will be reviewed on a case-by-case basis and must be
          submitted within 7 days of purchase unless otherwise stated at the
          time of sale.
        </p>

        <h2 className="font-semibold">Subscriptions (If Introduced)</h2>
        <p>
          If recurring subscriptions are offered in the future, cancellation
          terms and billing details will be clearly stated at the time of
          signup.
        </p>

        <h2 className="font-semibold">Contact</h2>
        <p>
          For refund inquiries:
          <br />
          info@aicoachingsolutions.net
        </p>

        <p className="text-sm text-neutral-600">
          This policy may be updated if paid services are introduced.
        </p>
      </Prose>
    </PageShell>
  );
}
