# Rendering Strategy — Addis Eats

Question asked of every route: *does it depend on who is asking, and how stale may it be?*

| Route              | Strategy                          | One line of reasoning                                                              |
|--------------------|-----------------------------------|--------------------------------------------------------------------------------------|
| /                  | ISR, 1 h                          | Shows popular dishes from the dishes API, which is cached for an hour, so the page inherits that window |
| /menu              | ISR, revalidate = 3600            | Page 1 and its pager are prerendered; search, category and later pages are fetched by the client (SWR) from /api/dishes |
| /menu/[id]         | Static via generateStaticParams (20 pages, 1 h) | Every dish id comes from the API at build time; `dynamicParams = false` gives a real 404 for the rest |
| /cart              | Client                            | The cart is private to this browser tab and never leaves it until checkout          |
| /checkout          | Dynamic                           | Reads the session cookie to guard the page (redirects to /login); also reads `?dish=` |
| /login, /register  | Static shell, server actions      | The page is identical for everyone; the actions do the work on submit                |
| /orders            | Dynamic                           | One person's orders, read from the session cookie: never cacheable                   |
| /orders/[id]       | Dynamic + client poll             | Reads the session and the order on the server, then SWR polls every 5 s until it is delivered or cancelled |
| /api/dishes        | Route handler (GET)               | Search, category and paging for the client; reads `request.url`, so always dynamic   |
| /api/dishes/[id]   | Route handler (GET)               | One dish, or 404 with `{ error }`                                                    |
| /api/orders        | Route handler (POST)              | Writes are never cached; validated server-side                                       |
| /api/orders/[id]   | Route handler (GET)               | Polled by the tracking screen: 401 signed out, 403 not yours, 404 missing            |
| /api/session       | Route handler (GET)               | Reads the cookie; lets the static header know who is signed in                       |

## Build output (production build)

```
Route (app)             Revalidate  Expire
┌ ○ /                           1h      1y
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ƒ /api/orders/[id]
├ ƒ /api/session
├ ○ /cart
├ ƒ /checkout
├ ○ /login
├ ○ /menu                       1h      1y
├   /menu/[id]
│ ├ ● /menu/dish_1              1h      1y
│ ├ ● /menu/dish_2              1h      1y
│ ├ ● /menu/dish_3              1h      1y
│ └ ● [+17 more paths]
├ ƒ /orders
├ ƒ /orders/[id]
└ ○ /register

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

## What changed on Day 41

- **`/` and `/menu/[id]` now show a 1 h revalidate.** They read the dishes API with `fetch(..., { next: { revalidate: 3600 } })`, and a cached fetch gives the route the same window. That is correct: the menu is the same for everyone.
- **/menu stays ISR.** Reading `searchParams` on the server would have made it dynamic again, so the filters live in the URL but are read by a client component (`useSearchParams`). The server-rendered first page is also the Suspense fallback, so the static HTML is complete and crawlable.
- **/orders/[id] is new** and follows the Day 41 shape: the server renders the order, the client polls it. The route itself is dynamic because it reads the session cookie.

## Why the header does not read the session itself

`cookies()` anywhere in a route opts the whole route out of static. If the root layout read the session, every route would turn ƒ. Instead the header is static and one small client island asks `GET /api/session` who is signed in.
