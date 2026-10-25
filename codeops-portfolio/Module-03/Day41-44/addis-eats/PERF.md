# Performance — Addis Eats (Day 43)

Measured on a **production build** (`npm run build` then `npm run start`), Chrome Lighthouse, mobile,
Slow 4G + 4x CPU slowdown. Never on `npm run dev`. Every number below is from my own run.

## Before and after

| Change                                   | LCP   | CLS   | INP   | Page weight |
|------------------------------------------|-------|-------|-------|-------------|
| Starting point (Day 42 code)             | __ s  | __    | __ ms | __ kB       |
| Font: `next/font` instead of system-ui   | __ s  | __    | __ ms | __ kB       |
| `preload` on the one hero image          | __ s  | __    | __ ms | __ kB       |
| (add a row for every change you make)    |       |       |       |             |

## What each change did

- **Images:** every dish photo already goes through `next/image` (`DishImage`) with `fill` and an honest `sizes`. _Measured effect: …_
- **Preload:** `preload` is on exactly one image per page: the home hero and the dish-detail photo. Nothing else. _Measured effect: …_
- **Font:** Inter through `next/font/google` with `subsets: ["latin"]` and `display: "swap"`: no request to Google, metric-matched fallback. _CLS before/after: …_
- **Third-party scripts:** none in this project, so nothing to move to `next/script`. (Checked with `grep -rn "<script" src`.)
- **Biggest cause, in the waterfall:** … (the one bar that was longest, and what fixed it)

## Environment

- `.env.example` is committed with dummy values; `.env*.local` is gitignored.
- `NEXT_PUBLIC_SITE_URL` is the only public variable and holds no secret.
