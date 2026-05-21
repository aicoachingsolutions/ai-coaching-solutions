import { MvpComingSoonPage } from "@/components/mvp-coming-soon-page";

export const metadata = {
  title: "Break90 Golf — Coming Soon | AI Coaching Solutions",
  description:
    "Break90 Golf MVP for athletes is opening soon. Join the waitlist for early access to your AI golf coach.",
  alternates: { canonical: "/break90" },
};

export default function Break90ComingSoonPage() {
  return (
    <MvpComingSoonPage
      config={{
        product: "Break90 Golf",
        eyebrow: "Athlete golf tool",
        title: "Break90 Golf: your AI golf coach",
        subtitle:
          "Break90 coaches you through improvement — spot scoring leaks, focus practice, and move closer to breaking 90 with guidance built around your game.",
        features: [
          "Pinpoint what is costing you strokes",
          "AI-guided priorities for your next practice",
          "Clear coaching feedback between rounds",
        ],
        audience: "golfers",
        logo: "/images/break90-logo.svg",
        waitlistSource: "mvp-break90",
      }}
    />
  );
}
