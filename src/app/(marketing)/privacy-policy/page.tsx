import { PageShell, Prose } from "@/components/page-shell";

export const metadata = {
  title: "Privacy Policy | AI Coaching Solutions",
  description:
    "How AI Coaching Solutions collects, uses, and protects information submitted through this platform.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      subtitle="Last updated: March 2026"
    >
      <Prose>
        <p>
          AI Coaching Solutions is committed to protecting your privacy. This
          policy explains what information we collect, how it is used, and how
          it is protected.
        </p>

        <h2 className="font-semibold">1. Information We Collect</h2>

        <p>
          We may collect information that you voluntarily provide, including:
        </p>

        <ul className="list-disc pl-5">
          <li>Email addresses submitted through forms</li>
          <li>Coaching descriptions and athlete-related information entered into tools</li>
          <li>Optional athlete names or performance notes</li>
        </ul>

        <p>
          We do not require user accounts at this time.
        </p>

        <h2 className="font-semibold">2. How Information Is Used</h2>

        <p>
          Submitted information is used to generate structured coaching
          feedback and improve platform functionality.
        </p>

        <p>
          Some data may be processed using third-party AI services in order to
          generate coaching responses.
        </p>

        <h2 className="font-semibold">3. Children’s Information (COPPA)</h2>

        <p>
          This platform is intended for coaches, parents, and adults. It is not
          directed to children under the age of 13.
        </p>

        <p>
          We do not knowingly collect personal information directly from
          children under 13. If you believe such information has been submitted,
          please contact us for removal.
        </p>

        <h2 className="font-semibold">4. Student Data and FERPA Considerations</h2>

        <p>
          AI Coaching Solutions is not a school or educational institution and
          does not access official educational records. Coaches are responsible
          for ensuring that any information submitted complies with their
          school or district policies.
        </p>

        <h2 className="font-semibold">5. Data Storage and Security</h2>

        <p>
          We implement reasonable safeguards to protect submitted information.
          However, no online system can guarantee absolute security.
        </p>

        <h2 className="font-semibold">6. Data Sharing</h2>

        <p>
          We do not sell, rent, or trade personal information.
        </p>

        <p>
          Information may be processed by third-party service providers
          strictly for the purpose of operating this platform.
        </p>

        <h2 className="font-semibold">7. Data Removal Requests</h2>

        <p>
          You may request deletion of submitted information by contacting us.
        </p>

        <h2 className="font-semibold">8. Changes to This Policy</h2>

        <p>
          This policy may be updated periodically. Continued use of the site
          constitutes acceptance of any updates.
        </p>

        <h2 className="font-semibold">9. Contact</h2>

        <p>
          For privacy-related questions, contact:
          <br />
          info@aicoachingsolutions.net
        </p>
      </Prose>
    </PageShell>
  );
}
