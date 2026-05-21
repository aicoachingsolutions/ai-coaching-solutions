# Paste into another chat — Coming soon on Vercel app hub

Copy everything inside the block below into a **new chat** with folder **`C:\ai-coaching-web`** open (repo root, not `ai-coaching-solutions-main` alone).

---

```
## Task

Add a slim **“new website / tools coming soon”** notice on the **Vercel app hub** only. Do NOT rebuild the WordPress marketing homepage on Vercel.

Read first:
- docs/GAME-PLAN.md (WordPress = main site, Vercel = apps)
- docs/CHAT-HANDOFF-coming-soon-and-pro-copy.md (60 days Pro / founding program wording)

## Scope (Vercel only)

**In scope**
- A compact banner on `src/app/(marketing)/page.tsx` (app hub home), above the existing “Launch a coaching tool” hero
- Optional: same banner in `src/app/(marketing)/layout.tsx` if it should show on `/practice-planner` and `/break90` too — ask yourself if one layout is cleaner; default to **hub home only** unless those pages need it
- Navy/gold styling to match existing app hub (`#0b1f3a`, `#ffd60a`, `#94a3b8` text)
- Link to full marketing site: `https://www.aicoachingsolutions.net` (from `NEXT_PUBLIC_MARKETING_SITE_URL`)

**Out of scope**
- Full WordPress hero, video, multi-section landing page
- Duplicate of `site-announcement.php` from WordPress verbatim
- Blog, SEO pages, or replacing www.aicoachingsolutions.net

## Canonical copy (use this)

**Badge:** `Coming soon`

**Title:** `More tools launching on this app hub`

**Body:** `Practice Planner and Break90 Golf founding programs are opening here soon — 60 days of Pro free for founding coaches and golfers. Free Swing Analyzer is live now. Full marketing story and program details stay on www.aicoachingsolutions.net.`

**CTAs**
1. Primary: `Open Free Swing Analyzer` → `/free-breakdown` (or existing tracked link component)
2. Secondary: `Full site →` → `NEXT_PUBLIC_MARKETING_SITE_URL` (new tab)

Do NOT say “new marketing website on Vercel.” Say **app hub / tools** launching.

## Pro wording (must match site today)

- `60 days of Pro free` (not 30 or 90)
- `Founding coach` / `Founding golfer` programs
- `Up to 120 days` with milestones (one line max in banner)
- Free tool: `FREE — No login` for Swing Analyzer only

Long MVP copy stays in `src/lib/mvp-programs.ts` only.

## Implementation

1. Create `src/components/app-hub-coming-soon-banner.tsx` (or similar) — one component, reused
2. Import on app hub home only (unless you justify layout-wide)
3. Place **above** the hero; keep hero subtitle aligned with CHAT-HANDOFF:
   - Hero body: “Free Swing Analyzer is live now. Founding coach and golfer programs include 60 days of Pro free when access opens…”
   - Tools section subtitle: “Free Swing Analyzer is live today. Founding coach and golfer programs (60 days Pro, up to 120 days with milestones) open soon…”
4. Run `npm run build` from repo root
5. Do not add `SiteAnnouncementBanner` from old attempts if deleted — new component name

## Domains

- Marketing (WordPress): https://www.aicoachingsolutions.net
- App hub (this repo): https://app.aicoachingsolutions.net

## Deliverables

- List files changed
- Confirm banner is on Vercel app hub only, not a second marketing site
- No git commit unless I ask
```

---

## If they meant WordPress instead

Wrong repo. Use this one-liner in a chat with **`c:\xampp\htdocs\aicoachingsite`** open:

```
Add/verify homepage coming soon banner: template-parts/sections/site-announcement.php on front-page.php before hero. Domains: www.aicoachingsolutions.net (this site), app.aicoachingsolutions.net (preview CTA). See wp-content/themes/ai-coaching-solutions/docs/CHAT-HANDOFF-coming-soon-and-pro-copy.md
```

WordPress banner already exists in theme v1.7.1+ — other chat may only need deploy/sync, not rebuild.
