import { MvpComingSoonPage } from "@/components/mvp-coming-soon-page";
import { BREAK90_FOUNDING_GOLFER_PROGRAM } from "@/lib/mvp-programs";

export const metadata = {
  title: "Break90 Golf — Founding Golfer MVP | AI Coaching Solutions",
  description:
    "Break90 Pro free for 60 days for founding golfers. Full Pro access, structured feedback, and optional extensions up to 120 days. Start now — no credit card.",
  alternates: { canonical: "/break90" },
};

export default function Break90MvpPage() {
  return (
    <MvpComingSoonPage
      config={{
        product: "Break90 Golf",
        eyebrow: "Athlete golf tool",
        title: "Break90 Golf: your golf coach",
        subtitle:
          "Break90 coaches you through improvement — spot scoring leaks, focus practice, and move closer to breaking 90 with guidance built around your game.",
        features: [
          "Pinpoint what is costing you strokes",
          "Coaching priorities for your next practice",
          "Clear coaching feedback between rounds",
        ],
        audience: "golfers",
        logo: "/images/break90-logo.png",
        waitlistSource: "mvp-break90",
        program: BREAK90_FOUNDING_GOLFER_PROGRAM,
        live: true,
        liveUrl: "https://break90.app/signin?mvp=golfer",
      }}
    />
  );
}
