import { Callout, PageShell, Prose } from "@/components/page-shell";

export const metadata = {
  title: "About | AI Coaching Solutions",
  description:
    "Built by a coach for the daily work of coaching—practice planning, clear feedback, and tools that support your decisions.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="AI Coaching Solutions"
      subtitle="Built for coaches who want practical help—without hype."
    >
      <Prose>
        <p>Hi Coach — I’m glad you’re here.</p>

        <p>
          My name is Joseph Vachon. I built AI Coaching Solutions from the
          perspective of someone who understands the daily work of coaching.
        </p>

        <p>
          I bring over 25 years of coaching experience and more than 30 years in
          the IT industry to one simple mission: help coaches think clearly,
          prepare efficiently, and lead with confidence — without adding more
          stress to their day.
        </p>

        <p>
          I’ve coached across youth and high school levels, including baseball,
          basketball, and volleyball — boys and girls — and I’ve coached girls
          high school basketball at all three levels. I also run a week-long
          summer camp that brings in 40–60 girls each year, from 4th grade
          through incoming freshmen.
        </p>

        <p>
          I know what it’s like to wear every hat: building practice plans late
          at night, breaking down film over the weekend, communicating with
          parents, and trying to keep a team connected when things get hard.
        </p>

        <p>
          This platform was built to support that reality. It’s not about
          replacing coaching judgment. It’s about strengthening the preparation
          behind it.
        </p>

        <Callout title="What this is built for">
          <ul className="list-disc space-y-2 pl-5 text-neutral-800">
            <li>Structured athlete feedback that’s clear and usable</li>
            <li>Mechanical breakdowns that point to one next priority</li>
            <li>Practice planning support that respects how coaches think</li>
            <li>Communication help for players and parents</li>
            <li>Time savings where it actually matters</li>
          </ul>
        </Callout>

        <p>
          Everything here is built with one priority in mind: practical
          application in real practices, real seasons, and real conversations.
        </p>

        <p>
          If you care about doing the work the right way, you’re in the right
          place.
        </p>

        <p className="pt-2">
          — <br />
          <span className="font-semibold">Joseph Vachon</span>
          <br />
          Founder, AI Coaching Solutions
          <br />
          Coach &amp; Technologist
        </p>
      </Prose>
    </PageShell>
  );
}
