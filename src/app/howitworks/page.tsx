import { PageShell, Prose, Callout } from "@/components/page-shell";

export const metadata = {
  title: "How It Works | AI Coaching Solutions",
  description:
    "A coaching-first process: describe what you’re seeing, get structured feedback, and apply it in practice—without hype.",
  alternates: { canonical: "/howitworks" },
};

export default function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="How It Works"
      title="Coaching-first tools, built for real use"
      subtitle="The goal is simple: help you get to clear, practical next steps faster—then you make the final call as the coach."
    >
      <Prose>
        <p>
          AI Coaching Solutions is built to support the daily work of coaching:
          identifying patterns, organizing feedback, and turning “what we’re
          seeing” into an actionable plan.
        </p>

        <Callout title="Start with the Free Breakdown">
          <div className="space-y-3">
            <p className="text-sm text-neutral-800">
              The Free Swing &amp; Pitching Breakdown is the fastest way to try
              the platform.
            </p>

            <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-800">
              <li>
                <span className="font-medium">Describe what you’re seeing</span>{" "}
                (age, level, and the main issue).
              </li>
              <li>
                <span className="font-medium">Get a structured breakdown</span>{" "}
                (mechanics, timing, cues, next focus, and a recommended drill).
              </li>
              <li>
                <span className="font-medium">Apply it in practice</span> and
                calibrate to the athlete.
              </li>
            </ol>

            <p className="text-xs text-neutral-600">
              Tip: The more specific your description (miss patterns, timing,
              what “good” looks like), the sharper the feedback.
            </p>

            <div className="pt-2">
              <a
                href="/free-breakdown"
                className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Try Free Breakdown
              </a>
            </div>
          </div>
        </Callout>

        <Callout title="What it is (and what it isn’t)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-800">
            <li>
              <span className="font-medium">It is:</span> a coaching draft that
              helps you organize feedback and choose a next priority.
            </li>
            <li>
              <span className="font-medium">It isn’t:</span> a replacement for
              in-person evaluation, athlete context, or your coaching judgment.
            </li>
          </ul>
        </Callout>

        <Callout title="What’s coming">
          <p className="text-sm text-neutral-800">
            I’m building this with the coaching community. As the platform
            grows, you’ll see more tools added based on what coaches actually
            ask for.
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-800">
            <li>Practice planning support (fast, usable, coach-style)</li>
            <li>Player evaluation templates and season checkpoints</li>
            <li>Expanded analyzers and sport-specific tools</li>
            <li>Resources library built around real coaching problems</li>
          </ul>

          <p className="mt-3 text-xs text-neutral-600">
            No hype. No overpromises. Just steady improvements that save coaches
            time and sharpen decision-making.
          </p>
        </Callout>

        <p className="pt-2">
          If you have feedback after using the breakdown tool, I want to hear
          it. That’s how this platform gets better.
        </p>

        <div className="pt-2">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Send feedback
          </a>
        </div>
      </Prose>
    </PageShell>
  );
}
