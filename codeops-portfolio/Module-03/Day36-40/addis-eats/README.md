# Addis Eats — Next.js Foundations Project (Day 40)

The Day 35 food-ordering app rebuilt on Next.js 16 (App Router): file routing, nested layouts,
a chosen rendering strategy per route, server components fetching their own data, and my own
endpoints and server actions behind them. Mock data layer (`src/lib/db.js`) until a real database.

## Run it

```
npm install
npm run build
npm run start        # http://localhost:3000  (present from this, not from npm run dev)
```

No environment variables are needed, and nothing sensitive is read by client code.

## Documents

- `STRATEGY.md` — every route, its rendering strategy, one line of reasoning, and the build output
- `BOUNDARY.md` — every component, which side it runs on, why, and the bundle numbers

## Endpoints

| Method | Path               | Success | Errors                                                        | Notes                               |
|--------|--------------------|---------|----------------------------------------------------------------|--------------------------------------|
| GET    | /api/dishes        | 200     | —                                                              | All dishes                           |
| GET    | /api/dishes/[id]   | 200     | 404 `{ "error": "No such dish" }`                              | One dish                             |
| POST   | /api/orders        | 201     | 400 bad JSON · 422 `{ error, fieldErrors }`                    | Validated with `orderSchema` (zod)   |
| GET    | /api/session       | 200     | —                                                              | `{ user }` or `{ user: null }`; the header's client fetch |

Error shape is always `{ "error": "...", "fieldErrors"?: { field: ["message"] } }`.

`/api/dishes` is built for callers outside my own pages (a future mobile app): none of my pages
call it, because server components read the data directly. `/api/session` is the one handler my
own UI calls, from a client component, because the answer is private to one browser tab.

### Server actions (`src/app/actions.js`, `"use server"`)

| Action                      | Used by                | Checks inside the action                                         |
|-----------------------------|------------------------|--------------------------------------------------------------------|
| `placeOrder`                | /checkout form         | session · `orderSchema` · each dish looked up, prices rebuilt on the server |
| `cancelOrder(orderId)`      | /orders (bound form)   | session · order exists · order belongs to this user                |
| `registerAction` / `loginAction` | /register, /login | zod schemas · duplicate phone or email · wrong password · sets the session cookie. Phone number is the identifier (email optional); login accepts phone or email |
| `logoutAction`              | header                 | deletes the session cookie                                         |

## Prove the contract with curl

```
curl localhost:3000/api/dishes | head
curl -i localhost:3000/api/dishes/not-a-dish
# HTTP/1.1 404   {"error":"No such dish"}

curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Almaz","phone":"0912"}'
# HTTP/1.1 422   {"error":"Validation failed","fieldErrors":{"phone":["Phone number must start with 09… or +2519… followed by 8 digits"]}}

curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
  -d '{"name":"Almaz","phone":"0912345678"}'
# HTTP/1.1 201   the new order
```

## Build output

```
Route (app)           Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ƒ /api/session
├ ○ /cart
├ ƒ /checkout
├ ○ /login
├ ○ /menu                     1h      1y
├   /menu/[id]
│ ├ ● /menu/dish_1 … dish_4
├ ƒ /orders
└ ○ /register

○ static   ● prerendered from generateStaticParams   ƒ dynamic
```

First Load JS (gzip, from `node scripts/first-load-js.mjs` after a build — Next 16 no longer prints sizes):

```
/ 178.8 kB   /menu 180.3 kB   /cart 179.9 kB   /checkout 174.9 kB   /login 174.6 kB   /orders 173.4 kB
```

Most of that is the React and Next runtime. A page with no client islands of its own (/orders) is
173.4 kB, so the menu's own client code adds about 7 kB. Day 35 (Vite) baseline: `<paste>`.

## Verification I ran on the production build

- Build markers match `STRATEGY.md` line by line.
- `grep -r '"use client"' src` → 8 files, none of them a page (`BOUNDARY.md` defends each one).
- Search of `.next/static` for server-only code (`verifyUser`, `registerUser`, session cookie name, stored passwords): nothing found.
- curl: 404 on unknown dish, 422 with `fieldErrors.phone`, 201 on a valid order, 400 on bad JSON.
- Signed-out `/checkout` → 307 redirect to `/login`. Signed-out `/orders` asks to log in.
- Attack on my own action: a second account submitting the cancel for the first account's order → refused, order stays PENDING; the owner can cancel.
- JavaScript disabled: `/checkout?dish=dish_3&qty=2` renders fully on the server; an invalid phone shows the message beside the field; a valid post places the order.
- `/menu` HTML contains every dish (indexable, works without JavaScript); `/menu/not-a-dish` → 404 status.

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

## Accounts and photos

- Register with name, **phone number** (09… or +2519…, spaces ignored) and password; email is optional. Log in with the phone number or the email. `0912345678` and `+251912345678` are the same account, and checkout pre-fills the account's phone.
- Dish photos are found by **name** in `public/images/`: `Doro Wat.jpg`, `doro-wat.png` and `DORO_WAT.webp` all match the dish "Doro Wat" (case, spaces, dashes and extension are ignored). A dish without a photo shows a placeholder.

## Known limits (mock data layer)

- Users and orders live in server memory and reset when the server restarts.
- The session cookie holds the user id and is not signed; passwords are stored in plain text. A real database needs hashed passwords and signed sessions (week 9, Day 42).
- Dish ids are fixed at build time (`dynamicParams = false`), so a dish added later needs a rebuild.

## 8-minute walkthrough

0–1 what it does and which routes exist · 1–3 live on `npm run start` (menu → dish → cart → login → checkout → orders → cancel) · 3–5 `STRATEGY.md` and the `/menu` change of mind · 5–7 `BOUNDARY.md` and the bundle numbers · 7–8 the curl 422 and the cancel attack.
