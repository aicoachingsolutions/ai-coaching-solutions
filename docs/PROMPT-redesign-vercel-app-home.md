# Handoff — Redesign Vercel app home (do NOT touch WordPress)

**Paste the block below into a new chat.** Open folder: **`C:\ai-coaching-web`** (repo root with `src/`, not only `ai-coaching-solutions-main`).

**Critical:** Do **not** edit `c:\xampp\htdocs\aicoachingsite\` or any WordPress theme files. WordPress is already correct and is the **main marketing site**.

---

## Copy this prompt

```
## Task: Redesign the Vercel app homepage only

Read first:
- docs/GAME-PLAN.md
- docs/CHAT-HANDOFF-coming-soon-and-pro-copy.md

### Do NOT touch WordPress
- No changes under c:\xampp\htdocs\aicoachingsite\
- No changes under wordpress-theme/ unless user explicitly asks later
- WordPress (www.aicoachingsolutions.net) stays as-is — full marketing site with video hero

### What this page is
- URL: https://app.aicoachingsolutions.net (Vercel)
- Role: **Current app entry page** — where users open tools and sign in
- NOT labeled “App hub” anywhere (user hates that — looks unprofessional)
- NO background video, NO hero video, NO video elements on this site

### What’s wrong today (fix all of this)
File: src/app/(marketing)/page.tsx

Current top has:
- Eyebrow “App hub” ← REMOVE
- H1 “Launch a coaching tool” ← REPLACE with professional app-home hero
- Generic layout that doesn’t match WordPress quality

User wants the **top completely remade** — professional like the WordPress marketing site (navy/gold, Inter sans-serif, structured sections), but **without** copying the full WP homepage or video.

### Design reference (match feel, not full clone)
WordPress theme (read only, do not edit):
c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions\

Reference for look & structure:
- template-parts/sections/site-announcement.php — coming soon banner pattern
- template-parts/sections/hero.php — eyebrow, H1, subtitle, MVP card, CTAs (but NO video on Vercel)
- template-parts/sections/platform-overview.php — tools section title + cards
- assets/css/main.css — colors: #071426, #0b1f3a, #ffd60a, #f8fafc, #94a3b8; Inter font

Use **sans-serif (Inter)** via next/font on marketing layout — user screenshot showed serif and it looked wrong.

### New page structure (top to bottom)

1. **Coming soon banner** (new component, e.g. src/components/app-coming-soon-banner.tsx)
   - Badge: `Coming soon`
   - Title: `New website experience launching soon` (or `More coaching tools launching soon` — not “App hub”)
   - Body: Practice Planner and Break90 founding programs opening here — **60 days of Pro free** for founding coaches and golfers. Free Swing Analyzer is live now. Full brand story on **www.aicoachingsolutions.net**.
   - CTAs: `Try Free Swing Analyzer` → /free-breakdown; `Full marketing site →` → NEXT_PUBLIC_MARKETING_SITE_URL (new tab)
   - Style: gold border, navy background — like WordPress .site-announcement

2. **App home hero** (replace entire current top section — no “App hub”)
   - Eyebrow: `AI Coaching Solutions` (gold, uppercase tracking — like WordPress hero)
   - H1: `One AI Platform. Multiple Coaching Solutions.` OR `Your coaching tools` — pick one that reads as **app home**, not startup landing fluff; prefer aligned with WordPress H1 if it fits app context
   - Subtitle: Coaching tools for real programs — practice planning, swing analysis, and more. Built for coaches and athletes.
   - Optional compact **Early access** card (like WordPress hero__mvp, static, no video):
     - Badge: `Early access open`
     - Short copy: 60 days Pro for founding coaches/golfers when programs open; Free Swing Analyzer live now
     - Buttons: links to #tools, /free-breakdown, /practice-planner, /break90 as appropriate
   - Primary CTA row below card: `Try Free Swing Analyzer` (primary gold), `Explore tools` (secondary outline) → #tools
   - Background: solid navy gradient / scrim only — **no video**

3. **Tools section** (keep card grid, improve section header)
   - H2: `Coaching Tools Built for Your Program` (match WordPress platform-overview)
   - Subtitle: use canonical copy from CHAT-HANDOFF (60 days Pro, founding programs, Free Analyzer live today)
   - Tool cards: keep existing badges/copy (FREE — No login; 60 days Pro — MVP; Opening soon)

4. **Footer**
   - Keep existing SiteHeader/Footer with BrandLogo
   - Remove or soften awkward line “Marketing, SEO, and program story” if it feels like this page is secondary — optional one line: link to www.aicoachingsolutions.net for full marketing site

### Pro / MVP wording (must stay consistent)
From src/lib/mvp-programs.ts and CHAT-HANDOFF:
- 60 days of Pro free (not 30/90)
- Founding coach / founding golfer
- Up to 120 days with milestones (short mentions only on home; detail on /practice-planner and /break90)

### Files likely to touch (Vercel only)
- src/app/(marketing)/page.tsx — main rewrite
- src/app/(marketing)/layout.tsx — add Inter font, font-sans on main
- src/components/app-coming-soon-banner.tsx — new
- src/components/app-home-hero.tsx — new (optional split)
- Maybe shared button classes in one small constants file

### Out of scope
- WordPress PHP/CSS
- Adding video anywhere on Vercel
- Rebuilding blog, about, or full marketing site on Vercel
- Changing src/lib/mvp-programs.ts unless copy on home is wrong

### Verify
- npm run build passes
- No “App hub” text anywhere on app home (grep to confirm)
- No <video> tags on marketing routes

### Deliverables
- List files changed
- Before/after summary of top section
- Do not git commit unless user asks
```

---

## Domains reminder

| Site | URL |
|------|-----|
| WordPress (main marketing) | https://www.aicoachingsolutions.net |
| Vercel (apps — this task) | https://app.aicoachingsolutions.net |

---

## Current Vercel file to replace content in

`src/app/(marketing)/page.tsx` — lines ~96–118 are the unprofessional “App hub” block the user wants gone.
