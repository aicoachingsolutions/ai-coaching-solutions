# Brand alignment — WordPress marketing ↔ Next.js apps (Vercel)

## Who goes where

| Surface | URL (typical) | Role |
|---------|----------------|------|
| **WordPress** | `https://aicoachingsolutions.com` (local: `http://localhost/aicoachingsite/`) | **Canonical marketing** — SEO, hero video, full story, MVP callouts. Customers land here and **click through** to apps. |
| **Next.js on Vercel** | `https://app.aicoachingsolutions.com` | **Temporary app hub** — `/free-breakdown` (live), `/practice-planner` and `/break90` (MVP coming-soon landings until launch). Coach app at `/app/*` stays in development. |

WordPress theme links to Vercel via `ACS_VERCEL_APP_URL` in `wp-config.php` (`acs_app_url()` in the theme).

Vercel home links back via `NEXT_PUBLIC_MARKETING_SITE_URL` (defaults to `https://aicoachingsolutions.com`).

## Projects

| Role | Path |
|------|------|
| **Marketing site (WordPress)** | `c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions\` |
| **Apps + app hub (Next.js)** | `C:\ai-coaching-web\ai-coaching-solutions-main` |

## Workspace (both folders)

Open `ai-coaching.code-workspace` (**File → Open Workspace from File…**) or add both folders manually.

## Cursor rule

`.cursor/rules/wordpress-marketing-brand.mdc` — WordPress owns marketing UX; Vercel uses matching tokens only where needed for the app hub.

## Design tokens (shared navy/gold)

```css
--deep-navy: #071426;
--navy: #0b1f3a;
--gold: #ffd60a;
--gold-bright: #ffe566;
--white: #f8fafc;
--muted-gray: #94a3b8;
```

## Key files

| Area | Files |
|------|--------|
| Vercel app hub (temporary) | `src/app/(marketing)/page.tsx` |
| MVP coming soon (pre-launch) | `src/app/(marketing)/practice-planner/page.tsx`, `break90/page.tsx` |
| Coach app (light UI) | `src/app/app/**`, `src/app/globals.css` |
| Free analyzer | `src/app/free-breakdown/page.tsx` |
| WordPress homepage | `front-page.php`, `template-parts/sections/hero.php`, `platform-overview.php` |
| WP → Vercel URLs | `wp-config.php` → `ACS_VERCEL_APP_URL` |

## Env (Vercel)

```bash
NEXT_PUBLIC_MARKETING_SITE_URL=https://aicoachingsolutions.com
NEXT_PUBLIC_BREAK90_URL=https://break90.app
# Practice planner defaults to /app/practice-planner
```

## Run locally

```bash
cd C:\ai-coaching-web\ai-coaching-solutions-main
npm install
npm run dev
```

- App hub: http://localhost:3000  
- WordPress: http://localhost/aicoachingsite/
