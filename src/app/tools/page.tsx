import { EmailSignupForm } from "@/components/email-signup-form";

export const metadata = {
  title: "Tools | AI Coaching Solutions",
  description:
    "A coach-first tools platform in progress: practice planning, evaluations, advanced breakdowns, and team tools. Built with the coaching community.",
};

type ToolCard = {
  title: string;
  description: string;
  status: "Available" | "Coming soon";
};

const TOOL_GROUPS: { heading: string; sub: string; items: ToolCard[] }[] = [
  {
    heading: "Free Breakdown",
    sub: "Start here. It’s the simplest way to see how the platform thinks.",
    items: [
      {
        title: "Free Swing & Pitching Breakdown",
        description:
          "Structured feedback with mechanics, timing, coaching cues, next focus, and one drill. No login.",
        status: "Available",
      },
    ],
  },
  {
    heading: "Practice Tools",
    sub: "Build better plans faster — without losing the human side of coaching.",
    items: [
      {
        title: "Practice Planner",
        description:
          "Create a clean session plan based on your time, goals, and constraints (numbers, space, energy level).",
        status: "Coming soon",
      },
      {
        title: "Drill Finder",
        description:
          "Find the right drill for the exact problem you’re seeing — with coaching points and common mistakes.",
        status: "Coming soon",
      },
      {
        title: "Culture & Communication",
        description:
          "Short, usable language for tough moments: effort issues, roles, parents, confidence, and leadership.",
        status: "Coming soon",
      },
    ],
  },
  {
    heading: "Evaluation Tools",
    sub: "Simple frameworks that help you be consistent and fair.",
    items: [
      {
        title: "Player Evaluation Notes",
        description:
          "Quick evaluations with strengths, growth priorities, and what to coach next — built for real seasons.",
        status: "Coming soon",
      },
      {
        title: "Mid-Season Check-In",
        description:
          "A structured way to assess progress, reset priorities, and keep the team moving forward.",
        status: "Coming soon",
      },
    ],
  },
  {
    heading: "Team Tools",
    sub: "Better clarity for coaches and players. Less noise.",
    items: [
      {
        title: "Scouting Helper",
        description:
          "Turn notes into a simple plan: what to take away, what to live with, and what to emphasize in practice.",
        status: "Coming soon",
      },
      {
        title: "Game Plan Builder",
        description:
          "Build a clear, one-page plan for your staff and players — offense, defense, specials, and emphasis.",
        status: "Coming soon",
      },
    ],
  },
];

function StatusPill({ status }: { status: ToolCard["status"] }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold";
  const cls =
    status === "Available"
      ? `${base} border-emerald-200 bg-emerald-50 text-emerald-900`
      : `${base} border-neutral-200 bg-neutral-50 text-neutral-800`;
  return <span className={cls}>{status}</span>;
}

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Tools
        </h1>
        <p className="max-w-2xl text-sm text-neutral-700 sm:text-base">
          I’m building AI Coaching Solutions the same way I coach: start simple,
          earn trust, and keep what’s useful. The free breakdown is live. The
          rest is being built with the coaching community.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/free-breakdown"
            className="inline-flex w-full items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 sm:w-auto"
          >
            Try the Free Breakdown
          </a>
          <a
            href="/howitworks"
            className="inline-flex w-full items-center justify-center rounded-md border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 sm:w-auto"
          >
            See how it works
          </a>
        </div>

        <p className="text-xs text-neutral-600">
          Coach-first promise: this is meant to support your decisions — not
          replace them.
        </p>
      </section>

      {/* Tool groups */}
      <div className="flex flex-col gap-10">
        {TOOL_GROUPS.map((group) => (
          <section key={group.heading} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{group.heading}</h2>
              <p className="max-w-2xl text-sm text-neutral-700">{group.sub}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((tool) => (
                <div
                  key={tool.title}
                  className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold">{tool.title}</h3>
                    <StatusPill status={tool.status} />
                  </div>
                  <p className="text-sm text-neutral-700">{tool.description}</p>

                  {tool.status === "Available" ? (
                    <a
                      href="/free-breakdown"
                      className="mt-1 inline-flex items-center text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
                    >
                      Open tool →
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-neutral-600">
                      Want early access? Join the waitlist below.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Waitlist (stub UI only) */}
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Get early access</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-700">
          If you want to help shape these tools, join the waitlist. I’ll send
          occasional updates when something is ready to test.
        </p>

        <div className="mt-4">
          <EmailSignupForm
            source="tools-page"
            type="waitlist"
            buttonLabel="Join waitlist"
            successMessage="You are on the waitlist. Check your inbox for confirmation."
          />
        </div>

        <p className="mt-2 text-xs text-neutral-600">
          No spam. Just tool updates when they’re ready.
        </p>
      </section>

      {/* Closing note */}
      <section className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-sm font-semibold">What’s “coming soon” mean?</h2>
        <p className="mt-2 text-sm text-neutral-700">
          It means I’m building this in public, one useful tool at a time.
          Simple first. Reliable first. Coaches first.
        </p>
      </section>
    </div>
  );
}
