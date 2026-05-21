import { MvpComingSoonPage } from "@/components/mvp-coming-soon-page";
import { PRACTICE_PLANNER_COACH_PROGRAM } from "@/lib/mvp-programs";

export const metadata = {
  title: "Practice Planner — Founding Coach MVP | AI Coaching Solutions",
  description:
    "Practice Planner Pro free for 60 days for founding coaches. Full Pro access, structured feedback, and optional extensions up to 120 days. Join the waitlist.",
  alternates: { canonical: "/practice-planner" },
};

export default function PracticePlannerComingSoonPage() {
  return (
    <MvpComingSoonPage
      config={{
        product: "Practice Planner",
        eyebrow: "Lead coaching tool",
        title: "Plan better practices in minutes",
        subtitle:
          "The Practice Planner is the coaching tool we are putting first — organize drills, set focus areas, and build structured practices without replacing your full coaching system.",
        features: [
          "Drag-and-drop practice structure",
          "Connect drills from your library",
          "Share plans with staff and athletes",
        ],
        audience: "coaches",
        logo: "/images/practice-planner-logo.png",
        waitlistSource: "mvp-practice-planner",
        program: PRACTICE_PLANNER_COACH_PROGRAM,
      }}
    />
  );
}
