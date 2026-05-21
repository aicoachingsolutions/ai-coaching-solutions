import { MvpComingSoonPage } from "@/components/mvp-coming-soon-page";

export const metadata = {
  title: "Practice Planner — Coming Soon | AI Coaching Solutions",
  description:
    "Practice Planner MVP for coaches is opening soon. Join the waitlist for early access to structured practice planning.",
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
        logo: "/images/practice-planner-logo.svg",
        waitlistSource: "mvp-practice-planner",
      }}
    />
  );
}
