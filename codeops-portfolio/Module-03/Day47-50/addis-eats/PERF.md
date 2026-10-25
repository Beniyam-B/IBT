# PERF.md — Addis Eats

Measured on the **deployed production build** (not `npm run dev`), Chrome Lighthouse, mobile, Slow 4G + 4x CPU slowdown.
Baseline taken after the features were complete and before any optimisation (Day 42 code).

## Budget

| Measure | Target | Before | After | Caused by |
|---------|--------|--------|-------|-----------|
| LCP, throttled | Under 2.5 s | __ s | __ s | _the change that moved it most_ |
| CLS | Under 0.1 | __ | __ | _next/font fallback, image dimensions via `fill` + aspect-ratio box_ |
| First Load JS, /menu (gzip) | Under 120 kB | 187.1 kB | __ kB | see "Target missed" |
| Largest image | Under 150 kB | __ kB | __ kB | _next/image resize + WebP/AVIF_ |
| Lighthouse performance | 90 or better | __ | __ | |

## Changes, one at a time

| Change | LCP | CLS | Page weight |
|--------|-----|-----|-------------|
| Starting point (Day 42) | __ | __ | __ |
| `next/font` (Inter, latin subset, swap) | __ | __ | __ |
| `preload` on the one hero image per page | __ | __ | __ |
| (add a row for each further change) | | | |

## Target missed: First Load JS, /menu

`/menu` is 187.1 kB gzip (Day 42, from `node scripts/first-load-js.mjs`). `/orders`, a page that ships almost no JavaScript of its own, is 173.5 kB. So roughly 170 kB is the floor set by Next.js and React themselves, and a 120 kB target cannot be met by this application's own code. The ~13 kB difference on `/menu` is SWR plus the search component (about 7 kB since Day 41), which the live search needs. Server components, no third-party scripts, and server-only font, metadata and JSON-LD code (Days 43 and 44) add no client JavaScript. _Re-run the script after the Day 43 and 44 changes and put the real number in the "After" cell._

## What I did not need

- `next/script`: there are no third-party scripts in this project (`grep -rn "<script" src` finds only the JSON-LD tag).
- `remotePatterns`: dish photos are local files in `public/`, not remote URLs.

## Environment

`.env.example` is committed with dummy values; `.env*.local` is gitignored. The only public variable is `NEXT_PUBLIC_SITE_URL`, which holds no secret and is inlined at build time.
