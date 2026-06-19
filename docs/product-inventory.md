# AI Coaching Solutions — Product Inventory

> Current state of every product, for marketing + the new website. Live vs. built
> vs. coming-soon is called out precisely. Last updated: 2026-06.

**Brand:** AI Coaching Solutions — *AI tools built by a coach.*
**New website goal:** feature **Swing Analyzer** + **Break90** (live), the rest **Coming Soon**.

## LIVE — feature these

### 1. Swing Analyzer (the hero / acquisition product)
- **What:** AI swing & pitching breakdown. Describe what you see (or upload a clip) →
  root-cause mechanics, timing, coaching cues, a drill, and a next focus in under a minute.
- **Sports:** baseball, softball, golf.
- **Live now:** free text analyzer at **analyzer.aicoachingsolutions.net** (no login, instant).
- **Built, not yet switched on:** video upload with *proof of vision* (shows the frames it
  analyzed + circles the key fault), tiered access, payments (credit packs + Pro). On a branch
  awaiting config (Stripe + DB migration + env). → "video coming soon" is a legit teaser.
- **Pricing model:** free (text unlimited + 2 video lifetime), credit packs (e.g. $4.99/5,
  $9.99/15), Pro (~$14.99/mo, up to 20 videos/mo + PDF + history).
- **Audience:** coaches, parents, players. Broad, very TikTok-friendly (shareable annotated frames).
- **Stack:** Next.js 14, Supabase (shared acs-prod), OpenAI (gpt-5.4-mini text, gpt-4o vision), Stripe.

### 2. Break90 (golf — separate product)
- **What:** golf scoring & practice app — track rounds, find what's costing you strokes,
  AI practice priorities after each round.
- **Live:** **break90.aicoachingsolutions.net** (MVP-ready).
- **Separate** product, separate purchase, separate audience (individual golfers). Own billing.
- **Stack:** Firebase (intentionally separate from the coaching apps).

## COMING SOON — teaser only

### 3. Practice Planner (the coach-world flagship)
- **What:** AI-assisted practice planning — pick a template, set block times, auto-fills drills
  from your library; Pro gets an AI-generated first draft.
- **Status:** ~50% built. Lives at **app.aicoachingsolutions.net** (not launch-ready).
- **Audience:** baseball/softball coaches.

### 4. Team Analyzer — not built. Team stats, trends, AI recommendations. Future (needs Practice
Planner's central stats first).

### 5. Future apps — Team Builder, Communication/Culture. Vision-stage.

## Marketing angles already in hand
- **"Proof it watched your swing"** — video analyzer shows the frames + circles the fault.
  Screenshot-and-share by nature.
- **"Built by a coach, not a tech company."**
- **Free, instant, no login** for the text analyzer — frictionless top-of-funnel.
- **TikTok Live format:** run viewer swings on stream → AI breakdown on screen → "link in bio,
  first 2 free."
- **Multi-sport potential** (basketball, QB, tennis) — same engine; a *post-launch* growth lever.

## Positioning decisions
- **Lead with the Swing Analyzer** (acquisition); Practice Planner is the deeper coach tool next.
- **Break90 stays its own lane** (golfers), separate purchase.
- **One brand umbrella**, one front door; "Coming Soon" for the unfinished apps.
- **Sequence, don't sprawl** — analyzer first, then Practice Planner (see platform-roadmap.md §12).

## Live URLs
| Product | URL | State |
|---------|-----|-------|
| Swing Analyzer | `analyzer.aicoachingsolutions.net` | Live (text); video built, pending config |
| Break90 | `break90.aicoachingsolutions.net` | Live (MVP) |
| Practice Planner | `app.aicoachingsolutions.net` | ~50%, not launch-ready |
| Main site (being replaced) | `aicoachingsolutions.net` | v1, replacing now |
