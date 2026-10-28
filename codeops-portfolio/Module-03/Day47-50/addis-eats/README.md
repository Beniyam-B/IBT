# Addis Eats — Next.js Advanced Project (Week 9)

The Day 35 food-ordering app rebuilt on Next.js 16 (App Router): file routing, nested layouts,
a chosen rendering strategy per route, server components fetching their own data, and my own
endpoints and server actions behind them. Mock data layer (`src/lib/db.js`) until a real database.

**Deployed URL:** ibt-blond.vercel.app

## Run it

From a fresh clone:

```
git clone <repo-url> && cd addis-eats-day45
cp .env.example .env.local     # then edit it; .env.local is gitignored
npm install
npm run build
npm run start                  # http://localhost:3000  (present from this, not from npm run dev)
```

Variables (see `.env.example`): `NEXT_PUBLIC_SITE_URL` is the public address of the site and is **inlined at build time**, so change it and rebuild. `DISHES_API_URL` is optional. `next/font` downloads Inter during `npm run build`, so the first build needs internet.

`DISHES_API_URL` is optional (it defaults to the public dishes API). Nothing sensitive is read by client code.

## Documents

- `AUTH.md` — the three layers (proxy, page, action), route by route, the session design and the attacks I ran
- `PERF.md` — the performance budget, before and after, and what caused each change
- `DATA.md` — every client query: its key, its refresh rule, and why
- `STRATEGY.md` — every route, its rendering strategy, one line of reasoning, and the build output
- `BOUNDARY.md` — every component, which side it runs on, why, and the bundle numbers

## Endpoints

| Method | Path                | Success | Errors                                              | Called by                         |
|--------|---------------------|---------|-----------------------------------------------------|------------------------------------|
| GET    | /api/dishes         | 200 `{ items, total, page, pageSize, totalPages }` | — (bad params fall back to defaults) | `MenuBrowser` (SWR): search, category, pages 2+ |
| GET    | /api/dishes/[id]    | 200     | 404 `{ "error": "No such dish" }`                   | outside callers                    |
| POST   | /api/orders         | 201     | 401 signed out · 400 bad JSON · 422 `{ error, fieldErrors }` | outside callers (my own UI uses the `placeOrder` action) |
| GET    | /api/orders/[id]    | 200     | 401 signed out · 403 not yours · 404 missing        | `OrderStatus` (SWR poll, every 5 s) |
| GET    | /api/session        | 200 `{ user }` or `{ user: null }` | —                         | `Providers` (header and Add-to-cart buttons) |

`/api/dishes` query: `?q=tib&category=Main&page=2&pageSize=8`. Error shape is always
`{ "error": "...", "fieldErrors"?: { field: ["message"] } }`.

An endpoint exists only because something calls it. `/api/dishes` and `/api/orders/[id]` are called by the
browser (search, paging and polling cannot be server components); `/api/session` by the header. `POST /api/orders`
and `GET /api/dishes/[id]` are not called by my pages: they are for outside callers (a mobile app, a webhook).

### Data

- **Dishes** come from a public JSON API (20 dishes). `src/lib/db.js` fetches it with `next: { revalidate: 3600 }` and falls back to a bundled copy (`src/lib/dishes.fallback.json`) if it cannot be reached. Override the source with `DISHES_API_URL`.
- **Users and orders** are in memory (mock) until a real database exists.
- **Order status** moves on by itself so the polling screen has something to show: PENDING, then PREPARING after 20 s, ON THE WAY after 50 s, DELIVERED after 90 s (`STAGES` in `db.js`). An order can only be cancelled while PENDING.

### Server actions (`src/app/actions.js`, `"use server"`)

| Action                      | Used by                | Checks inside the action                                         |
|-----------------------------|------------------------|--------------------------------------------------------------------|
| `placeOrder`                | /checkout form         | session · `orderSchema` · each dish looked up, prices rebuilt on the server |
| `cancelOrder(orderId)`      | /orders (bound form)   | session · order exists · order belongs to this user · still PENDING |
| `advanceOrder(orderId)`     | /kitchen (bound form)  | session · role is staff · order exists                             |
| `registerAction` / `loginAction` | /register, /login | zod schemas · duplicate phone or email · bcrypt hash compare · starts a database session (httpOnly, secure in production, sameSite lax) · redirects only to a same-site `next` |
| `logoutAction`              | header                 | deletes the server-side session and the cookie                     |

## Prove the contract with curl

```
curl "localhost:3000/api/dishes?q=tib&page=1"
# {"items":[Tibs, Derek Tibs],"total":2,"page":1,"pageSize":8,"totalPages":1}
curl -i localhost:3000/api/dishes/not-a-dish
# HTTP/1.1 404   {"error":"No such dish"}

# the orders endpoint needs a signed-in session: sign in in the browser, then copy the `session`
# cookie value from DevTools > Application > Cookies (it is httpOnly, so only DevTools can show it)
curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" -b "session=<token>" \
  -d '{"name":"Almaz","phone":"0912"}'
# HTTP/1.1 422   {"error":"Validation failed","fieldErrors":{"phone":["Phone number must start with 09… or +2519… followed by 8 digits"]}}

curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" -b "session=<token>" \
  -d '{"name":"Almaz","phone":"0912345678"}'

curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" -d '{"name":"Almaz","phone":"0912345678"}'
# HTTP/1.1 401   {"error":"Not signed in"}
# HTTP/1.1 201   the new order
```

## Build output

See `STRATEGY.md` for the full table. Summary: `/` ○ 1h, `/menu` ○ 1h, `/menu/[id]` ● (20 pages), `/cart` ○,
`/checkout` ƒ, `/orders` ƒ, `/orders/[id]` ƒ, all `/api` routes ƒ.

First Load JS (gzip, `node scripts/first-load-js.mjs` after a build):

```
/ 179.0 kB   /menu 187.1 kB   /cart 180.1 kB   /checkout 175.1 kB   /login 174.9 kB   /orders 173.5 kB
```

`/menu` grew about 7 kB from Day 40 (180.3 kB): that is SWR and the search/paging component. Day 35 (Vite) baseline: `<paste>`.

## Verification I ran on the production build

- Build markers match `STRATEGY.md` line by line.
- `grep -r '"use client"' src` → 8 files, none of them a page (`BOUNDARY.md` defends each one).
- Search of `.next/static` for server-only code (`verifyUser`, `registerUser`, session cookie name, stored passwords): nothing found.
- curl: 404 on unknown dish, 422 with `fieldErrors.phone`, 201 on a valid order, 400 on bad JSON.
- Signed-out `/checkout` → 307 redirect to `/login`. Signed-out `/orders` asks to log in.
- Attack on my own action: a second account submitting the cancel for the first account's order → refused, order stays PENDING; the owner can cancel.
- JavaScript disabled: `/checkout?dish=dish_3&qty=2` renders fully on the server; an invalid phone shows the message beside the field; a valid post places the order.
- `/menu` HTML contains every dish (indexable, works without JavaScript); `/menu/not-a-dish` → 404 status.

- Day 41: `/api/dishes` search (`q=tib` → Tibs, Derek Tibs), category, paging (3 pages for 20 dishes), page clamping and garbage parameters; `/api/orders/[id]` returns 401 / 403 / 404 / 200 as documented; `/orders/[id]` is server-rendered with the real status and no loading text; the demo order advances to PREPARING after about 20 s; the menu HTML contains page 1 and the pager link `?page=2`; the app still serves the menu and the API when the dishes API is unreachable.
- Not verified here (needs a browser): the 300 ms debounce, the list not flashing between searches, and the 5 s poll updating the screen. Check them with the network tab open: one request per pause in typing, and a request to `/api/orders/…` every 5 seconds until the order is delivered.

## The six failure checks (do these in the browser on `npm run start`)

| Do this                         | Expect                                                                   |
|---------------------------------|---------------------------------------------------------------------------|
| Throttle to Slow 3G, open /menu | `loading.js` skeleton appears; header and sidebar already there          |
| Throw inside the menu page      | `error.js` renders; header and cart survive (see note)                   |
| Open /menu/not-a-dish           | `not-found.js`, status 404, not a crash                                  |
| Post an invalid phone number    | 422 and the message beside the field                                     |
| Disable JavaScript, submit      | The server action still places the order                                 |
| Search the bundle for a secret  | Nothing sensitive in `.next/static`                                      |

Note for check 2: `/menu` is static, so a throw would fail the *build*. To demonstrate it, add
`export const dynamic = "force-dynamic"` and a `throw new Error("boom")` to `menu/page.js`, build,
start, open /menu (the browser shows `error.js` after the streamed error reaches the client
boundary), then revert both lines.

## Decisions I changed my mind about

- `/menu`: first built with filters in the URL (`?q=&category=`), which read `searchParams` and made it dynamic. I moved the filter state into one client shell that hides already-rendered cards, so the route is ISR (1 h) and the menu HTML is complete for crawlers.
- `/checkout`: first a static shell with the checks only in the action. It now reads the session on the server and redirects when signed out, so it is dynamic, and the action still re-checks everything.
- Pages are server components; `"use client"` sits only on leaves (cart view, checkout form, auth form, menu shell, header nav, add-to-cart button, providers, `error.js`).

## Accounts, sessions and protected routes

- Register with name, **phone number** (09… or +2519…, spaces ignored) and password; email is optional. Log in with the phone number or the email.
- Passwords are stored only as bcrypt hashes. The session is a random token in an `httpOnly` cookie, kept in a server-side store, so signing out ends it for real.
- `/cart`, `/checkout`, `/orders` and `/kitchen` are protected in three layers (proxy, page, action). Signed-out visitors do not even see links to them. Full detail and the attacks I ran are in `AUTH.md`.
- Demo staff account for `/kitchen`: phone `0900000000`, password `staff123`.

## Photos

- `0912345678` and `+251912345678` are the same account, and checkout pre-fills the account's phone.
- Dish photos are found by **name** in `public/images/`: `Doro Wat.jpg`, `doro-wat.png` and `DORO_WAT.webp` all match the dish "Doro Wat" (case, spaces, dashes and extension are ignored). A dish without a photo shows a placeholder.

## Known limits (mock data layer)

- Users and orders live in server memory and reset when the server restarts. The order status is a demo timer, not a real kitchen.
- The dishes come from a public CDN file that has no search or paging of its own, so `/api/dishes` filters and pages it in my own code.
- Users and sessions are in memory and reset on restart. No rate limiting, password reset or social sign-in; a real product would use Auth.js or a hosted provider.
- Dish ids are fixed at build time (`dynamicParams = false`), so a dish added later needs a rebuild.

## 8-minute walkthrough

0–1 what it does and which routes exist · 1–3 live on `npm run start` (menu → dish → cart → login → checkout → orders → cancel) · 3–5 `STRATEGY.md` and the `/menu` change of mind · 5–7 `BOUNDARY.md` and the bundle numbers · 7–8 the curl 422 and the cancel attack.

## Week 9 additions (Days 43-45)

- **Performance (Day 43):** `next/font` (Inter, self-hosted), `preload` on exactly one image per page, `.env.example`. Numbers in `PERF.md`.
- **Discovery (Day 44):** title template and `metadataBase` in the root layout, a distinct description on every route, `generateMetadata` and MenuItem JSON-LD per dish, generated Open Graph image per dish, `sitemap.xml` built from the dishes, `robots.txt` excluding private routes.
- **Verify on the deployed site:** view source on `/menu/dish_3` (absolute `og:image`, canonical, JSON-LD); open `/sitemap.xml` and `/robots.txt`; run the attacks in `AUTH.md`; take Lighthouse before and after.

## Deploying

The users, sessions and orders are in memory. On a serverless host each request may reach a different instance, so a login can vanish between requests. Use a host that runs one long-lived Node process (`npm run start`), or replace `src/lib/db.js` with a real database before deploying. After the first deploy, set `NEXT_PUBLIC_SITE_URL` to the real address and **redeploy**: it is baked in at build.
