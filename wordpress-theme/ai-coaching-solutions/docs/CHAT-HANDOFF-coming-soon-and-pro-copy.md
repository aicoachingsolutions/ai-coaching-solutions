# Handoff for another chat — Coming soon banner + Pro/MVP copy

Paste this entire file into a new chat when working on **WordPress marketing** or the **Vercel app hub**. Goal: one consistent voice for **60 days Pro**, **founding coach/golfer programs**, and **coming soon** — no duplicate marketing site on Vercel.

---

## Two sites (do not mix them up)

| Site | URL | What it is |
|------|-----|------------|
| **Marketing** | `https://www.aicoachingsolutions.net` | WordPress theme — full story, SEO, homepage announcement |
| **App hub** | `https://app.aicoachingsolutions.net` | Vercel Next.js — tool launcher only, **not** a second marketing site |

**Do not** add the WordPress “coming soon” homepage banner on Vercel.

---

## Canonical Pro / MVP rules (use everywhere)

1. **Always say** `60 days` (not 30 or 90) for free Pro access at launch.
2. **Always say** `Pro` (capital P) for paid tier: “60 days of Break90 Pro”, “Practice Planner Pro”.
3. **Founding programs:** “Founding coach program” (Practice Planner), “Founding golfer program” (Break90).
4. **Extension:** “Earn up to 120 days” with published milestones (optional one line on cards).
5. **Status for not-open tools:** badge `Opening soon` (not just “Coming soon” on cards unless the whole product is unrelated).
6. **MVP tool badge on cards:** `60 days Pro — MVP`
7. **Free Swing Analyzer:** `FREE — No login` — live today, no Pro trial wording.

---

## 1. WordPress — “Coming soon” homepage banner

**Only on WordPress front page**, before the hero.

### Files

| File | Purpose |
|------|---------|
| `template-parts/sections/site-announcement.php` | Banner copy + CTAs |
| `front-page.php` | `acs_section( 'site-announcement' );` before `hero` |
| `assets/css/main.css` | `.site-announcement` styles |
| `functions.php` | `acs_marketing_site_url()`, `acs_app_url()`, bump `ACS_THEME_VERSION` |

### Copy (canonical)

- **Badge:** `Coming soon`
- **Title:** `New app website launching soon`
- **Body:** We are launching our app hub at **app.aicoachingsolutions.net** — Free Swing Analyzer, founding MVP programs for Practice Planner and Break90 Golf, coach sign-in. Full marketing story stays on **www.aicoachingsolutions.net**.
- **CTA 1:** `See what’s launching` → `#tools`
- **CTA 2:** `Preview app hub` → `acs_app_url()` (opens app subdomain)

### wp-config.php

```php
define( 'ACS_VERCEL_APP_URL', 'https://app.aicoachingsolutions.net' );
define( 'ACS_MARKETING_SITE_URL', 'https://www.aicoachingsolutions.net' );
```

### Local path

`c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions\`

### GitHub sync

WordPress is **not** auto-deployed from Vercel. Copy theme to repo:

```powershell
cd C:\ai-coaching-web
.\scripts\sync-wordpress-theme.ps1
git add wordpress-theme
git commit -m "Sync WordPress theme"
git push
```

Upload `wordpress-theme/ai-coaching-solutions/` to hosting `wp-content/themes/`.

---

## 2. Vercel app hub — wording above the tools (fix this)

**File:** `src/app/(marketing)/page.tsx`

**Do not** add `SiteAnnouncementBanner` or a WordPress-style coming-soon block here.

### Hero (above tools) — canonical

| Element | Text |
|---------|------|
| Eyebrow | `App hub` |
| H1 | `Launch a coaching tool` |
| Body | `Free Swing Analyzer is live now. Founding coach and golfer programs include 60 days of Pro free when access opens — see Practice Planner and Break90 for the full program.` |
| CTA | `Choose a tool below` → `#tools` |

### Section above tool cards — canonical

| Element | Text |
|---------|------|
| H2 | `Open a tool` |
| Subtitle | `Free Swing Analyzer is live today. Founding coach and golfer programs (60 days Pro, up to 120 days with milestones) open soon — each tool page has the full MVP program.` |

### Tool cards — canonical

**Free Swing Analyzer**

- Badges: `FREE — No login` only
- Description: `Describe what you see and get a coaching breakdown in under 60 seconds.`
- Bullets: Swing and pitching · Copy, download, or email results · No account needed
- CTA: `Open Free Analyzer`

**Practice Planner**

- Badges: `60 days Pro — MVP` + `Opening soon`
- Description: `Founding coach program: full Pro for 60 days free — feedback on real practice plans. Earn up to 120 days.`
- Bullets: All Pro features during access · 2 check-ins + real plans we ask for · See full program on the Practice Planner page
- CTA: `Practice Planner MVP program →` → `/practice-planner`

**Break90 Golf**

- Badges: `60 days Pro — MVP` + `Opening soon`
- Description: `Founding golfer program: full Pro for 60 days free — feedback after real rounds. Earn up to 120 days.`
- Bullets: All Pro features during access · 2 check-ins + round logging we ask for · See full program on the Break90 page
- CTA: `Break90 MVP program →` → `/break90`

### Footer line on app hub

`Marketing, SEO, and program story:` link to `https://www.aicoachingsolutions.net`

---

## 3. Full MVP program pages (Vercel)

**Single source of truth:** `src/lib/mvp-programs.ts`

- `BREAK90_FOUNDING_GOLFER_PROGRAM`
- `PRACTICE_PLANNER_COACH_PROGRAM`

Rendered by `src/components/mvp-program-details.tsx` on:

- `/break90`
- `/practice-planner`

**Do not** duplicate long program copy in `page.tsx` — import from `mvp-programs.ts`.

Waitlist pages use `src/components/mvp-coming-soon-page.tsx`.

---

## 4. WordPress — align tools section with same Pro wording

**File:** `template-parts/sections/platform-overview.php`

### Section header above cards

- **Title:** `Coaching Tools Built for Your Program` (one line — `section__title--single-line`)
- **Subtitle:** `Free Swing Analyzer is live for athletes and coaches. Practice Planner and Break90 founding programs include 60 days of Pro free when access opens — up to 120 days with milestones.`

### Tool card descriptions (match Vercel)

| Tool | Description |
|------|-------------|
| Practice Planner | `Founding coach program: full Pro for 60 days free — feedback on real practice plans. Earn up to 120 days.` |
| Free Swing Analyzer | `Free for athletes and coaches — coaching breakdown in under 60 seconds for golf, baseball, and softball.` |
| Break90 Golf | `Founding golfer program: full Pro for 60 days free — feedback after real rounds. Earn up to 120 days.` |

### Tool card badges

| Tool | Badges |
|------|--------|
| Practice Planner | `Lead tool` + `60 days Pro — MVP` (use `pro_badge` field) |
| Free Swing Analyzer | optional `FREE — No login` if template supports |
| Break90 | `60 days Pro — MVP` |
| Coming-soon tools | `Coming soon` (Drill Library, etc.) |

### Section MVP callout

**File:** `template-parts/platform-mvp-callout.php`

- **Badge:** `Early access open`
- **Title:** `Founding coach and golfer programs`
- **Body:** Practice Planner and Break90 offer **60 days of Pro free** for founding users who test real workflows and share feedback. Free Swing Analyzer is live today on the app hub.

---

## 5. WordPress feature sections (`mvp-callout.php`)

Update Break90 and Practice Planner section callouts to mention **60 days Pro** (short version pointing to app hub MVP pages), not vague “MVP wanted” only.

---

## 6. Checklist for the other chat

- [ ] WordPress: `site-announcement` on `front-page.php`, domains `.net`
- [ ] WordPress: `platform-overview` subtitle + tool descriptions + `60 days Pro — MVP` badges
- [ ] WordPress: `platform-mvp-callout.php` uses 60-day Pro language
- [ ] Vercel: `page.tsx` hero + “Open a tool” subtitle match section 2 above
- [ ] Vercel: **no** homepage coming-soon banner
- [ ] Vercel: `/break90` and `/practice-planner` copy only in `mvp-programs.ts`
- [ ] Bump `ACS_THEME_VERSION` after CSS/PHP changes; hard-refresh
- [ ] Sync theme to `wordpress-theme/` and push OR FTP upload to WordPress host

---

## 7. First message to paste in the other chat

```
Read docs/CHAT-HANDOFF-coming-soon-and-pro-copy.md in this repo.

1) WordPress (c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions): 
   - Keep site-announcement coming soon banner on front page only.
   - Align platform-overview and MVP callouts with the same 60 days Pro / founding program wording as the Vercel app hub in that doc.

2) Vercel (C:\ai-coaching-web, src/app/(marketing)/page.tsx):
   - Fix hero and "Open a tool" subtitle to match the canonical copy in the doc.
   - Do NOT add a coming soon marketing banner on Vercel.

Use mvp-programs.ts as source of truth for long MVP program pages.
Domains: www.aicoachingsolutions.net (marketing), app.aicoachingsolutions.net (app hub).
```
