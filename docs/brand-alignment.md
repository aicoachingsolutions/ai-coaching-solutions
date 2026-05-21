# Brand alignment — WordPress marketing ↔ Next.js app

**Game plan:** [GAME-PLAN.md](./GAME-PLAN.md) — WordPress is the **main site**; Vercel is **where apps live**.

Use this doc when opening **this folder** in Cursor so chats match the WordPress landing site.

## Projects

| Role | Path |
|------|------|
| **Marketing site (WordPress)** | `c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions\` |
| **Product + marketing (Next.js)** | `C:\ai-coaching-web\ai-coaching-solutions-main` |

## Open the right folder in Cursor

1. **File → Open Folder**
2. Choose `C:\ai-coaching-web\ai-coaching-solutions-main` (not the WordPress `htdocs` folder).
3. Start a **new chat** in that workspace.

Chats in the WordPress folder do not see this repo automatically, and vice versa.

## Optional: both folders in one workspace

**File → Add Folder to Workspace** and add:

- `c:\xampp\htdocs\aicoachingsite`
- `C:\ai-coaching-web\ai-coaching-solutions-main`

Then you can ask: “Copy hero layout from `wp-content/themes/ai-coaching-solutions/template-parts/sections/hero.php` into `src/app/(marketing)/page.tsx`.”

## Cursor rule (already installed)

`.cursor/rules/wordpress-marketing-brand.mdc` applies when you edit marketing pages or site header/footer.

## First message template (paste in new chat)

```
Match the WordPress marketing theme at:
c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions\

Update src/app/(marketing)/page.tsx (and related components) to use:
- deep navy #071426 / #0b1f3a backgrounds
- gold #ffd60a accents and primary CTAs
- Inter, dark sections, hero + tool grid like platform-overview.php

Keep app routes (src/app/app/) on the light coach UI unless I say otherwise.
```

## Design tokens (WordPress marketing)

```css
--deep-navy: #071426;
--navy: #0b1f3a;
--gold: #ffd60a;
--gold-bright: #ffe566;
--white: #f8fafc;
--muted-gray: #94a3b8;
```

## Key files in this Next repo

| Area | Files |
|------|--------|
| Marketing home | `src/app/(marketing)/page.tsx` |
| Marketing layout | `src/app/(marketing)/layout.tsx` |
| Global styles | `src/app/globals.css` (light app theme + orange CTAs) |
| Header / footer | `src/components/site-header.tsx`, `footer.tsx` |
| Free analyzer | `src/app/free-breakdown/page.tsx` |
| Coach app | `src/app/app/**` |

## WordPress homepage announcement (not on Vercel)

The “new app website coming soon” banner is **WordPress only** (`site-announcement` before hero on www.aicoachingsolutions.net).

Do **not** duplicate that banner or a full marketing homepage on the Vercel app.

Theme files: `wordpress-theme/ai-coaching-solutions/` in this repo (sync from XAMPP with `scripts/sync-wordpress-theme.ps1`).

### Domains

| Constant | URL |
|----------|-----|
| `ACS_MARKETING_SITE_URL` (WordPress `wp-config.php`) | `https://www.aicoachingsolutions.net` |
| `ACS_VERCEL_APP_URL` | `https://app.aicoachingsolutions.net` |
| `NEXT_PUBLIC_MARKETING_SITE_URL` (Vercel `.env`) | Link **out** to WordPress only |

## MVP program copy (Vercel app)

Founding user programs (60 days Pro, extension tiers up to 120 days) live in:

- `src/lib/mvp-programs.ts` — `BREAK90_FOUNDING_GOLFER_PROGRAM`, `PRACTICE_PLANNER_COACH_PROGRAM`
- `src/components/mvp-program-details.tsx` — rendered on `/break90` and `/practice-planner`
- App hub cards: `src/app/(marketing)/page.tsx`

## Run locally

```bash
cd C:\ai-coaching-web\ai-coaching-solutions-main
npm install
npm run dev
```

Open http://localhost:3000
