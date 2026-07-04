# HIVE — Landing Site

Multi-page landing site for the [HIVE macOS app](https://github.com/LunaHook/hive) — a session command center for the OpenCode CLI.

Built with **Vite**, **GSAP + ScrollTrigger**, and **Supabase Auth**. Deployed automatically to GitHub Pages via GitHub Actions on every push to `main`.

---

## Pages

| Page | Path |
|------|------|
| Home (scroll narrative) | `/` |
| Downloads | `/downloads.html` |
| Time Capsule (version history) | `/time-capsule.html` |
| Presets & Configs | `/presets.html` |
| Account (Supabase Auth) | `/account.html` |
| Support / Donate (Ko-fi) | `/support.html` |

---

## Quick start

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173/`. Hot module replacement is enabled.

---

## Build & preview

```bash
npm run build     # outputs to dist/
npm run preview   # serve dist/ at http://localhost:4173/
```

---

## Supabase setup (Account page) {#supabase-setup}

The Account page uses [Supabase](https://supabase.com) for email/password auth. **You need a free Supabase project** — it takes about 5 minutes.

### Steps

1. Go to [supabase.com](https://supabase.com) and create a **free** account and project.
2. In your project dashboard: **Settings → API**.
3. Copy **Project URL** and **anon / public** key.
4. Open `src/js/supabase.config.js` and paste them:

```js
// src/js/supabase.config.js
export const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co'
export const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'
```

5. In the Supabase dashboard: **Authentication → Providers → Email** — enable it and save.
6. Optionally customise the confirmation email template at **Authentication → Email Templates**.

Until you fill in the real values, the Account page shows a "Supabase not configured" message instead of the login form.

---

## Ko-fi setup (Support page)

The Support page embeds your Ko-fi widget so visitors can donate any amount.

### Steps

1. Create a **free** account at [ko-fi.com](https://ko-fi.com).
2. Your Ko-fi username is the last part of your profile URL: `ko-fi.com/YOUR_USERNAME`.
3. Open `src/js/kofi.config.js` and paste it:

```js
// src/js/kofi.config.js
export const KOFI_USERNAME = 'YOUR_KOFI_USERNAME'
```

Until you fill in the real value, the Support page shows a setup placeholder with instructions.

---

## GitHub Pages deployment

The site is deployed automatically via GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`. The live URL is:

```
https://lunahook.github.io/hive-landing/
```

### One-time setup (do this once)

1. In the GitHub repo: **Settings → Pages → Source → GitHub Actions**.
2. Push any commit to `main` — the workflow will build and deploy automatically.
3. The live URL appears in the workflow run output and under **Settings → Pages**.

### Base URL

The workflow sets `VITE_BASE=/hive-landing/` so all asset paths resolve correctly at the subdirectory URL. If you configure a custom domain (so the site lives at the root `/`), change the workflow env var to `VITE_BASE=/`.

---

## Visual testing

Tests use [Playwright](https://playwright.dev) and run against the built preview server.

```bash
# Build first, then run tests (preview server starts automatically)
npm run build
npm run test:visual
```

Tests cover:
- All 6 pages load without JS errors
- Correct page titles
- Nav brand and links present on every page
- Active nav link matches the current page
- Footer renders on every page
- No critical overlapping elements (h1 not obscured by nav)
- Full-page screenshots at 1440×900 (desktop) and iPhone 14 (mobile)
- Download card hrefs point to the correct DMG files
- Copy button writes the config ID to clipboard
- Supabase unconfigured state displays correctly
- Scroll narrative has 4 chapters
- Mobile hamburger menu opens

---

## Project structure

```
hive-landing/
├── index.html              Home
├── downloads.html          Downloads
├── time-capsule.html       Version history timeline
├── presets.html            Theme preset gallery
├── account.html            Supabase Auth flow
├── support.html            Ko-fi donation + alternatives
├── src/
│   ├── css/
│   │   └── base.css        Full design system (tokens, all page styles)
│   └── js/
│       ├── nav.js          Shared nav + footer component
│       ├── starfield.js    Canvas starfield with mouse parallax
│       ├── home.js         Home page (GSAP ScrollTrigger narrative)
│       ├── downloads.js
│       ├── timecapsule.js
│       ├── presets.js      Copy-to-clipboard config IDs
│       ├── account.js      Supabase Auth logic
│       ├── support.js      Ko-fi iframe injection
│       ├── supabase.config.js  ← paste your Supabase credentials here
│       └── kofi.config.js      ← paste your Ko-fi username here
├── public/
│   ├── favicon.svg
│   └── .nojekyll           Prevents GitHub Pages Jekyll processing
├── tests/
│   └── visual.spec.js      Playwright tests
├── .github/workflows/
│   └── deploy.yml          Build → GitHub Pages on push to main
├── vite.config.js
├── playwright.config.js
└── package.json
```

---

## Tech stack

| Tool | Purpose |
|------|---------|
| [Vite 5](https://vitejs.dev) | Multi-page build, HMR, asset bundling |
| [GSAP + ScrollTrigger](https://gsap.com) | Scroll-driven narrative, hero entrance |
| [Supabase JS](https://supabase.com/docs/reference/javascript) | Email auth |
| [Playwright](https://playwright.dev) | Visual + interaction testing |
| [GitHub Actions](https://docs.github.com/en/actions) | CI/CD to GitHub Pages |

Design: Space Grotesk + Inter · Cyan `#22e0ff` + Violet `#b060ff` deep-space palette.
