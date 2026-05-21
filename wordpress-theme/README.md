# WordPress marketing theme (source for GitHub)

This folder is a copy of the **AI Coaching Solutions** WordPress theme used on **www.aicoachingsolutions.net**.

## Why it is here

Edits made only under `c:\xampp\htdocs\aicoachingsite\` do **not** reach GitHub unless you sync them here and push.

## Sync from local XAMPP

After changing the theme locally:

```powershell
.\scripts\sync-wordpress-theme.ps1
```

Or manually copy:

`c:\xampp\htdocs\aicoachingsite\wp-content\themes\ai-coaching-solutions\`  
→ `wordpress-theme\ai-coaching-solutions\`

Then commit and push from the repo root (`C:\ai-coaching-web`).

## Deploy to WordPress hosting

Upload `wordpress-theme/ai-coaching-solutions/` to:

`wp-content/themes/ai-coaching-solutions/`

Set in `wp-config.php` on the server:

```php
define( 'ACS_VERCEL_APP_URL', 'https://app.aicoachingsolutions.net' );
define( 'ACS_MARKETING_SITE_URL', 'https://www.aicoachingsolutions.net' );
```

## Domains

| Site | URL |
|------|-----|
| Marketing (WordPress) | https://www.aicoachingsolutions.net |
| App hub (Vercel) | https://app.aicoachingsolutions.net |
