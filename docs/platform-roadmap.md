# AI Coaching Solutions — Platform Roadmap & Product Strategy

> Planning document. Captures the long-term product vision, the free vs. paid
> split, the build sequence, and the architectural decisions that need to be made
> early. Nothing here is built yet unless noted. Last updated: 2026-05.

---

## 1. The Big Picture

AI Coaching Solutions is becoming a **platform**, not a single tool. There are two
distinct product families with different buyers:

### Family A — Coach / Team tools (baseball & softball)
Sold as **one "Coach Pro" subscription**. The buyer is a coach buying for their
program. These tools share data through a central coach profile.

- **Practice Planner** (+ Drill Library) — *MVP in progress*
- **Team Builder**
- **Team Analyzer** — stats, trends, AI recommendations
- **Swing Analysis** — free text version (funnel) → paid multi-photo version
- **Communication / Culture app** — "finishes the system"

### Family B — Individual-athlete tools (standalone)
Each sold **separately** with its own subscription and its own data. The buyer is
an individual athlete buying for themselves.

- **Break90** (golf) — separate product, separate data, separate subscription
- **Future:** another individual-sport coaching tool if demand appears

**Rule of thumb:** team tools bundle together; individual-athlete tools stand alone.

---

## 2. The Spine: Central Coach Profile + Shared Data Layer

The single most important architectural concept. Every Coach Pro app reads from and
writes to **one central data store tied to the coach's profile.**

```
        ┌─────────────────────────────────────────┐
        │   CENTRAL COACH PROFILE + DATA LAYER     │
        │   (teams, athletes, stats, drills)       │
        └─────────────────────────────────────────┘
              ▲        ▲        ▲        ▲        ▲
        Practice   Team      Team     Swing   Comm/
        Planner   Builder  Analyzer  Analysis Culture
        +Drill Lib

        ───────────── ONE "Coach Pro" subscription ─────────────

   Break90 (golf) ── separate product, separate data, separate sub
   Future individual-sport tool ── same: standalone
```

Team Analyzer only works because stats live in one place that every app feeds.
This shared layer is the foundation everything else stands on.

### ⚠️ Critical timing decision (ACTION)
**Practice Planner's MVP build should START the central stats layer now.** Even if
only Practice Planner uses it at first, its team/athlete/stat records must live in a
**shared shape that other apps can later read** — not in a private, Practice-Planner-only
structure.

If we skip this, Team Analyzer (the first app to read cross-app data) forces a painful
migration later. A small amount of schema design during the Practice Planner MVP avoids
a large retrofit afterward.

**What to define now:** where a coach's `team`, `athlete`, and `stat` records live, in a
shape queryable by future apps, under the coach's profile in the central store
(Supabase).

---

## 3. Free vs. Coach Pro

Free is a taste of each tool **in isolation**. Pro is the moment the tools start
talking to each other.

| Capability | Free | Coach Pro |
|---|------|-----------|
| Scope | Individual product basics | Full connected suite |
| Teams | None / single basic | **Multiple teams per coach** |
| Data sharing | None | **Shared central profile** |
| Team analysis | **Basic info only** | Trends, AI stats, recommendations |
| Practice Planner integration | ❌ | ✅ builds real practices |
| Individual athlete recommendations | ❌ | ✅ |
| Swing analysis | Text describe (funnel) | **Multi-photo + capture instructions** |
| Saved history | ❌ | ✅ |

The free tools are the top-of-funnel. The free Swing Analyzer especially exists to
prove the AI is good, capture emails, and pull coaches toward Coach Pro.

---

## 4. Build Sequence (Dependency Chain)

Order matters — each step depends on the one before it.

1. **Practice Planner MVP** — *in progress.* Gates everything.
   **Must also start the central stats layer** (see §2).
2. **Team Analyzer** — reads uploaded stats from the central store; calculates trends
   and AI-driven recommendations.
3. **Pro Swing Analysis** — multi-photo upload with capture instructions
   (do **not** start until Practice Planner MVP is finished).
4. **Communication / Culture app** — completes the Coach Pro system.

**Rides alongside Practice Planner:** the Drill Library with rewards + moderation (§6).

---

## 5. Swing Analysis — Free (now) → Pro (future)

### Free (live today)
- Coach **describes** the swing/pitch in words → expert text breakdown.
- Powered by the sport-framework engine (kinetic sequence + fault→cause + drills).
- Rate-limited (5/min, 20/day per IP), logs to Supabase `api_requests`.
- Copy / PDF / email. No account, no history. This is the **funnel.**

### Pro (future — after Practice Planner MVP)
- **Upload multiple photos with instructions** (not video — see note below).
- Same expert breakdown, now grounded in what the AI actually sees.
- Saved to the athlete's profile with history.
- Upgrade pitch: *"You've been typing what you see — now just show it."*

### Why photos, not video
Modern AI analyzes video only by sampling it into frames — "video analysis" is really
"analyzing many photos" plus extra cost and complexity. **Photo-first is the correct
practical call:** ~80% of the value at a fraction of the cost and engineering.

### The real challenge: guiding a usable capture
The hard part is **not** the AI — it's getting a usable photo. A swing photo at the
wrong moment or angle is useless. Plan to:
- Tell users **which moments** to capture (e.g., setup, contact/release, finish).
- Guide **camera angle** (face-on vs. down-the-line show different faults).
- Allow **multiple key frames** (likely 1–3) rather than a single image.

Budget more design effort on capture guidance than on the analysis itself.

### Shared engine (architecture note)
The sport-framework engine already powering the free analyzer is the same brain that
would power paid photo analysis *and* any future individual-sport tool. **Build it as a
shared, portable module** rather than baked into one page — write the coaching
intelligence once, wrap it in different products.

---

## 6. Drill Library — Rewards + Moderation

Part of Practice Planner. Coaches add drills and are **rewarded for original,
well-described drills.** Because rewards create incentive to game the system, the
moderation layer matters.

### Submission rules (gate before review)
- Required fields filled: name, setup, equipment, reps, coaching point, sport/skill level.
- Minimum description quality (reject "hit balls off tee").
- **Originality check** — dedupe against the existing library.

### Approval workflow (AI-assisted, human-decided)
- AI **pre-screens** each submission: completeness, quality, similarity to existing drills.
- AI drafts the **"why approved / why rejected"** explanation.
- A **human (you or a trusted reviewer) makes the final call** — AI recommends, human decides.
- Coach is **notified**: approved ✅ (reward granted) or rejected ❌ with the specific reason.

### Decisions to make
1. **What is the reward?** Free Pro time? Credits? Public recognition / leaderboard?
   This shapes the anti-abuse design.
2. **Manual vs. AI-assisted moderation?** Review by hand at low volume; add AI
   pre-screening as it grows. Build the hooks early.
3. **Originality bar.** Exact-duplicate blocking is easy; "too similar" is a judgment
   call AI can flag for human review.

---

## 7. Subscription & Packaging

- **Coach Pro** = one subscription unlocking the full team suite (Practice Planner,
  Team Builder, Team Analyzer, Swing Analysis, Communication/Culture).
- **Break90** and future individual-sport tools = **separate** subscriptions, separate data.
- Selling "the platform" for one monthly price is a far easier sell than several
  small per-tool fees. The free tools feed the funnel.

---

## 8. Open Decisions (parked until build time)

| Decision | Affects | When to decide |
|---|---|---|
| Central data schema shape | Everything in Coach Pro | **During Practice Planner MVP** |
| Drill reward currency (Pro time / credits / recognition) | Drill Library, anti-abuse | Before Drill Library reward launch |
| Multi-photo count + which angles | Pro Swing Analysis UX | Before Pro Swing Analysis build |
| Refactor framework engine into shared module | Swing Analysis, future tools | Before building tool #2 that uses it |
| Manual vs. AI-assisted drill moderation | Drill Library ops | When submission volume grows |

---

## 9. Guiding Principles

- **One engine, many front doors.** Write coaching intelligence once; reuse across products.
- **Central data is the spine.** Design the shared layer early; retrofitting is expensive.
- **Free proves, Pro connects.** Free tools showcase the AI in isolation; Pro is where
  they integrate.
- **Photo over video.** Practical, cheaper, good enough.
- **AI recommends, humans decide** — especially for drill moderation and rewards.
- **Team tools bundle; individual tools stand alone.**

---

## 10. Analyzer-First Go-To-Market, Gating & Monetization

**Strategic shift:** the **Swing Analyzer is the lead acquisition product**, not Practice
Planner. It's live, genuinely good, instantly shareable, and needs no onboarding —
while Practice Planner still has work to do. Lead with the analyzer to pull users in,
then expand them into the rest of the Coach Pro suite.

### Monetization model: usage-capped freemium (+ video for Pro)
Free to a point, then pay for more uses. This caps AI cost and creates a clean,
honest upgrade moment ("you've used your free breakdowns").

| Tier | Who | Limit | Identity |
|------|-----|-------|----------|
| Anonymous free | Anyone, no login | a few/day (IP) | none — *exists today (IP rate-limit)* |
| Free account | Signed in | a few more/month | user_id |
| **Pro** | Paid | high/unlimited + **video layer** + central-DB personalization | user_id + subscription |

- **"Pay for more uses" requires accounts** — you can't meter a person without login.
  So the paid analyzer needs auth, while the anonymous free tier stays open as the hook.
- The current IP rate-limiting **is** the anonymous tier; accounts + entitlements come
  from the shared backbone.
- **Do not gate the front door.** Keep the first taste instant and login-free; meter
  *additional* uses. Shareability is the acquisition engine.

### One shared pay/gating system across all modules
The analyzer's paid tier uses the **same** auth + billing + entitlements as Practice
Planner and every future module. One **Coach Pro** account unlocks everything. Never
build per-product billing.

### The moat: analyzer ↔ central database
This is the most important idea. An analyzer that answers one-off questions is a
commodity. An analyzer that **remembers a coach's (or individual's) athletes, stats,
and notes**, personalizes its advice from them, and **feeds its findings back** into
that same store for Practice Planner / Team Analyzer to use — that is defensible and
unique. It only works if the analyzer sits on the **same data backbone** as everything
else. Both directions:
- Central stats/notes → inform the analyzer's suggestions (personalized, not generic).
- Analyzer output → written back as notes/records the AI reuses later, and can tell a
  user where to go next / what to feed the analyzer.

### The required architecture: ONE Supabase backbone (acs-prod)
Unified billing + central data + AI personalization all require **one** Supabase
project carrying: **auth** (one login), **subscriptions/entitlements** (one billing),
and the **central coach + individual data** (stats, notes, saved analyses). That
backbone is **`acs-prod`** (already has `subscriptions`, `profiles`, `team_stat_*`).

### ✅ DECISION (locked): build the gated analyzer inside v2 (`practice-planner-main`)
`acs-prod` is built by **`ai-coaching-solutions-v2`** (local: `C:\practice-planner-main`)
— Next.js 14 + Supabase (Postgres + Auth + RLS), no ORM. It **already has** everything
the paid analyzer needs:
- **Supabase Auth** (magic-link) — `lib/auth.ts` `requireUser()`
- **Subscription gating** — `subscriptions` table (`plan_type`: free/lite/trial/paid/pro),
  `getUserSubscriptionPlan()`, `isProSubscription()` (already gates the AI generator)
- **Central stats** — `team_stat_reports/values/signals` with RLS, and a
  **`source_app` column built for multiple apps** (defaults `'practice_planner'`; the
  analyzer writes `'swing_analyzer'`). `subject_type` already supports `'player'`.
- **OpenAI** integration (`OPENAI_API_KEY` + `OPENAI_MODEL`)

So the gated/paid analyzer is **built in v2**, reusing its auth + subscriptions + central
stats. We do **NOT** wire the v1 repo (Clerk + Neon) to acs-prod — that would mean two
identity systems for the same users.

**Closed out:** the v1 Drizzle `central-stats-layer` branch (athletes/stat_records on
Neon) is **redundant and deleted** — v2's `team_stat_*` supersedes it. The v1 repo keeps
serving the **free, ungated funnel** until full consolidation.

### Build order for the analyzer
1. Consolidate the analyzer onto the **acs-prod Supabase backbone** (auth + subscriptions + central data).
2. Build the **usage ladder + entitlements** (anonymous → free account → Pro).
3. Build the **video layer** (Pro-only) — *after* gating works. Even "video" is best
   handled as extracted key frames; it's the most expensive/complex piece, so it
   follows, it doesn't lead.
4. Wire the **analyzer ↔ central stats/notes** loop — the moat.

### Cautions
- Video is expensive (storage + processing + capture UX). Pro-only, and later.
- Don't duplicate billing — reuse acs-prod's.
- Keep the anonymous free analysis ungated at the entry point.

### Pro analyzer tier — spec (locked)
The paid tier of the Swing Analyzer, gated in v2 by `isProSubscription`:
- **Unlimited usage** — no daily/monthly breakdown cap (free tiers are capped; Pro is not).
- **Eventual video upload (promised)** — Pro is marketed with **video analysis coming**.
  Pro subscribers get it when it ships; it's a roadmap commitment to Pro, built after the
  gating + usage ladder are live. (Under the hood, "video" = extracted key frames.)
- Everything the free tier gives, plus saved history and central-DB personalization
  (reads the coach's/athlete's prior stats + notes; writes results back tagged
  `source_app='swing_analyzer'`).

Free vs Pro at a glance:

| | Anonymous free | Free account | **Pro** |
|---|---|---|---|
| Breakdowns | a few/day (IP) | a few more/month | **unlimited** |
| Login | none | Supabase Auth | Supabase Auth |
| Saved history | ❌ | basic | ✅ full |
| Central-DB personalization | ❌ | ❌ | ✅ |
| **Video upload** | ❌ | ❌ | **✅ (promised / coming)** |

---

## 11. Break90 (Firebase) & the Two-Analyzer Architecture

### Decisions (locked)
- **Break90 stays on Firebase.** It's a deeply-built, working app, and always a
  **separate product with a separate purchase.** No migration to Supabase — moving a
  working app for tidiness isn't worth it, and the separation is intentional. (Migrating
  would only have made sense while it was empty; it isn't.)
- **No Firebase↔Supabase bridge.** Break90 (Firebase Auth + Firestore + its own Stripe)
  and the coaching apps (Supabase Auth + `subscriptions`) don't share identity or billing.
  Instead of bridging two stacks, **each product gets its own analyzer gated by its own
  billing.**

### Two analyzers, one engine
| Product | Analyzer | Auth | Pro gate |
|---------|----------|------|----------|
| Coaching apps | Supabase analyzer (`swing-analyzer` repo) | Supabase Auth | `subscriptions` table |
| **Break90** | its own **golf** analyzer | Break90 Firebase Auth | Break90's existing Stripe→Firestore Pro check |

### Break90 analyzer gating — use what Break90 already knows
Break90 already tracks Pro (Stripe → Firestore). So **embed the golf analyzer as a Break90
Pro feature** and gate it with Break90's **existing `isPro` check** — the user is already
logged in, so no email-gating is needed.
- *Fallback (only if the analyzer lives outside the Break90 login):* email-gate + look up
  Stripe by email for an active Break90 subscription. Email alone is weak proof — pair it
  with a **magic-link verification** so someone can't just type a Pro user's email.

### Don't fork the brain — share the engine
Both analyzers must share **one** coaching engine so quality never drifts. The engine
(`runBreakdown` / `runVideoBreakdown`) has **zero database dependency** in its core (OpenAI
+ sport frameworks + prompt); gating is separate, so it ports cleanly to the Firebase side.
Reuse options, easiest → cleanest:
1. **Copy** the engine into Break90 — fast, but drifts over time.
2. **Shared API** both front-ends call — each does its own gating.
3. **Shared package** (`@acs/coaching-engine`) imported by both — cleanest, no drift.

Break90's analyzer just calls the engine with `sport: "golf"` and gates with its own Stripe
check.

### Net
No bridge, no migration, "always separate" preserved — **two analyzers, one shared engine.**

---

## 12. Go-To-Market Sequencing (solo-builder focus order)

> The risk is spreading thin across Break90, Swing Analyzer, Practice Planner,
> Team Analyzer, and future apps. The discipline that fixes it: **finish ONE
> thing to done before starting the next.**

### State snapshot
- **Swing Analyzer** — ~90% (free text live; video paywall built, needs config + launch)
- **Practice Planner** — ~50% (flagship; months to a polished, sellable bar)
- **Team Analyzer** — not built (depends on Practice Planner's central stats)
- **Break90** — MVP-ready (separate product, Firebase, golfers)
- **Future apps** — later

### The roles (why this isn't "either/or")
The Swing Analyzer and Practice Planner play different roles and form one machine:
**analyzer acquires → Practice Planner retains.**

| | Swing Analyzer | Practice Planner |
|---|----------------|------------------|
| Role | Acquisition (the hook) | Retention / revenue (the core) |
| Value | Instant, no onboarding | Deep, needs setup + commitment |
| Virality | High (TikTok, shareable proof) | None |
| Stickiness | Low (occasional) | High (every practice) |
| Done-ness | ~90% | ~50% |

### The order
1. **Phase 1 — Launch the Swing Analyzer (first).** It's nearly done, viral, and
   revenue-capable. Finish config (Stripe, migration, env), polish, launch on TikTok.
   Collect emails + first revenue + validation. **Do not touch Practice Planner during
   this.** Rationale: ship what's almost shipped; get momentum, an audience, and proof
   the AI is good — which funds and de-risks everything after.
2. **Phase 2 — Finish Practice Planner** to a polished MVP (the coach-world flagship).
   Launch it **to the warm email list** the analyzer built. Position it as the coach's
   next step: "the AI that broke down your swing now plans your practices."
3. **Phase 3 — Team Analyzer + future apps.** Team Analyzer needs Practice Planner's
   central stats to exist first — premature until PP has traction.
4. **Break90 — its own lane, low attention.** Separate product for golfers; soft-launch
   whenever, but it is NOT part of the coach-world sequence and must not split focus.

### Introduce the world correctly
- **One front door.** Lead with the single polished thing (the analyzer) under
  "AI Coaching Solutions — built by a coach." "Coming soon" teasers are fine; the live
  experience people get must be finished.
- **Sequence, never parallelize.** One product to done before the next. This is the
  whole game for a solo builder.
- **Capture every lead.** The analyzer's job is emails + attention → the launchpad for
  Practice Planner.
- **Practice Planner is the upgrade story**, not a separate cold launch — same brand,
  same AI, the coach's deeper tool.

### One sentence
Launch the Swing Analyzer first (funnel, nearly done) → build audience + revenue →
finish Practice Planner as the flagship and sell to that warm list → and refuse to work
on more than one at a time.
