import { PageShell, Prose } from "@/components/page-shell";

export const metadata = {
  title: "Terms & Conditions | AI Coaching Solutions",
  description:
    "Terms governing use of AI Coaching Solutions, including AI-generated outputs, data usage, and limitations of liability.",
  alternates: { canonical: "/terms-conditions" },
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Terms & Conditions"
      title="Terms & Conditions"
      subtitle="Last updated: March 2026"
    >
      <Prose>
        <p>
          By accessing or using AI Coaching Solutions, you agree to the
          following Terms and Conditions. If you do not agree, please do not use
          the platform.
        </p>

        <h2 className="font-semibold">1. Use of the Platform</h2>
        <p>
          AI Coaching Solutions provides structured coaching tools and
          AI-generated feedback designed to assist coaches in organizing
          evaluation and practice planning.
        </p>
        <p>
          The platform is intended for use by adults, including coaches and
          parents. It is not directed to children under the age of 13.
        </p>

        <h2 className="font-semibold">2. AI-Generated Content Disclaimer</h2>
        <p>
          Feedback generated through this platform is produced using artificial
          intelligence systems and is provided for informational and
          organizational purposes only.
        </p>
        <p>
          AI-generated outputs are not guaranteed to be accurate, complete, or
          suitable for any specific athlete or situation. Final coaching
          decisions remain solely the responsibility of the user.
        </p>

        <h2 className="font-semibold">3. No Professional or Medical Advice</h2>
        <p>
          The platform does not provide medical, physical therapy, athletic
          training, or licensed professional advice. Users should consult
          qualified professionals when appropriate.
        </p>

        <h2 className="font-semibold">4. User Responsibilities</h2>
        <p>
          You agree not to submit unlawful, harmful, or inappropriate content.
        </p>
        <p>
          You are responsible for ensuring that any athlete information entered
          complies with applicable school, league, or organizational policies.
        </p>

        <h2 className="font-semibold">5. Student Data and FERPA</h2>
        <p>
          AI Coaching Solutions is not a school or educational institution and
          does not access official educational records. Users are responsible
          for ensuring compliance with any FERPA or local education
          regulations.
        </p>

        <h2 className="font-semibold">6. Intellectual Property</h2>
        <p>
          All platform content, structure, and branding are the property of AI
          Coaching Solutions.
        </p>
        <p>
          Users may use AI-generated outputs for coaching purposes but may not
          reproduce, resell, or redistribute platform content without
          permission.
        </p>

        <h2 className="font-semibold">7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, AI Coaching Solutions shall
          not be liable for any indirect, incidental, consequential, or special
          damages arising from use of the platform.
        </p>
        <p>
          Coaching decisions and athlete outcomes remain solely the
          responsibility of the user.
        </p>

        <h2 className="font-semibold">8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless AI Coaching Solutions from
          any claims, damages, or liabilities resulting from your use of the
          platform.
        </p>

        <h2 className="font-semibold">9. Modifications</h2>
        <p>
          These Terms may be updated periodically. Continued use of the
          platform constitutes acceptance of updated terms.
        </p>

        <h2 className="font-semibold">10. Contact</h2>
        <p>
          For legal inquiries:
          <br />
          info@aicoachingsolutions.net
        </p>
      </Prose>
    </PageShell>
  );
}
