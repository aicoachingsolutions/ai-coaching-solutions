# AI Coaching Solutions — WordPress Marketing Theme

Premium sports-tech SaaS marketing homepage for **Coach V / AI Coaching Solutions**. Built for WordPress (public marketing, SEO, conversion); product apps live on Vercel.

## XAMPP (this project)

Site root: `C:\xampp\htdocs\aicoachingsite\`  
URL: **http://localhost/aicoachingsite/**

1. Start Apache + MySQL in XAMPP.
2. Activate this theme under **Appearance → Themes**.
3. **Settings → Reading** → static homepage (uses `front-page.php`).

4. Add hero video (recommended):
   - Place `hero-coaches.mp4` in `assets/video/`
   - H.264, muted, 10–20s loop, max ~5MB
   - Until added, the hero uses the navy poster gradient fallback.

5. Replace logo: upload via **Appearance → Customize → Site Identity**, or replace `assets/images/coach-v-logo.svg`.

## Vercel app URLs

Add to `wp-config.php` before `/* That's all, stop editing! */`:

```php
define( 'ACS_VERCEL_APP_URL', 'https://your-app.vercel.app' );
```

CTAs use `acs_app_url()`:

| Path | Used for |
|------|----------|
| `login` | Header Login |
| `analyzer` | Free Swing Analyzer |
| `break90` | Break90 Golf |
| `practice-planner` | Practice Planner |
| `tools/drill-library` | Drill Library card |
| `tools/team-development` | Team Development card |

## Homepage sections

1. Hero (video + overlay + CTAs)
2. Trust bar
3. Platform overview (6 tool cards)
4. Free Swing Analyzer (lead magnet)
5. Break90 Golf
6. Practice Planner (module positioning)
7. Multi-sport grid
8. Why coaches use it
9. Ecosystem / coming soon
10. Final CTA

## File structure

```
├── front-page.php          # Homepage assembly
├── functions.php           # Enqueues, acs_app_url(), acs_section()
├── header.php / footer.php
├── template-parts/sections/  # One file per section
├── assets/css/main.css     # Brand CSS variables
├── assets/js/main.js       # Mobile nav, scroll header
├── assets/images/          # Logo, mockups, poster
└── assets/video/           # hero-coaches.mp4 (you provide)
```

## Customization

- **Colors:** edit CSS variables in `assets/css/main.css` (`:root`).
- **Copy:** edit section files in `template-parts/sections/`.
- **Screenshots:** swap `break90-mockup.svg` and `planner-mockup.svg` for PNG/WebP exports from the Vercel app.

## Requirements

- WordPress 6.0+
- PHP 7.4+
