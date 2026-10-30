# AUTH.md — Addis Eats: who may see what, and what each layer proves

Written from the code, route by route. Line numbers are in the files named.

## Decision one: who may see what

| Route | Who | Protected by | What that proves |
|-------|-----|--------------|------------------|
| /menu, /menu/[id], / | Everyone | Nothing | It is public, and stays static and indexable |
| /cart | Anyone signed in | Proxy | A session cookie exists. The cart itself lives in this browser and holds no private server data |
| /checkout | Any signed-in user | Proxy + page | Cookie exists, then `getSession()` found a real, unexpired session. The write (`placeOrder`) checks again |
| /orders | The owner | Proxy + page + scoped query | Signed in, and `getOrdersFor(user.id)` returns only that person's records |
| /orders/[id] | The owner | Proxy + page | Signed in, and `order.userId === user.id`; anyone else gets the same 404 as a missing order |
| /kitchen | Staff only | Proxy + page + role check in the action | Signed in, role is `staff`; `advanceOrder` checks the role again |
| /login, /register | Signed-out visitors | Page (bounces signed-in users) | `?next=` is passed through `safeNext` |

## The layers, in order

| Layer | File | Establishes | Does NOT establish |
|-------|------|-------------|--------------------|
| 1. Proxy | `src/proxy.js` | A cookie named `session` exists on /cart, /checkout, /orders, /kitchen | Who the person is, or that the token is valid |
| 2. Page | `getSession()` in each private page | The token maps to a live server-side session and a user | That a later write is allowed |
| 3. Action / handler | inside every action and `/api` handler | Session, then ownership or role, for THIS record | — this is the layer that cannot be bypassed |

## Every action and handler

| Name | Checks, in order | File:line |
|------|------------------|-----------|
| `placeOrder` | session · `orderSchema` · every dish re-read from the server, prices rebuilt · owner taken from the session | `actions.js` |
| `cancelOrder(orderId)` | session (80) · order exists · **`order.userId !== user.id` (84)** · still PENDING (86) | `actions.js` |
| `advanceOrder(orderId)` | session (96) · **role is staff (97)** · order exists | `actions.js` |
| `registerAction`, `loginAction` | zod · duplicate check / bcrypt compare · new session · `safeNext` on the redirect | `actions.js` 131, 152 |
| `logoutAction` | deletes the server-side session record AND the cookie | `session.js` `endSession` |
| `GET /api/orders/[id]` | 401 signed out (10) · 404 · **403 not yours (14)** | `api/orders/[id]/route.js` |
| `POST /api/orders` | 401 signed out · 400 bad JSON · 422 invalid · owner from the session | `api/orders/route.js` |

## The session cookie (`src/lib/session.js`)

`httpOnly` (script cannot read it) · `secure` in production (HTTPS only) · `sameSite: "lax"` (not sent on cross-site requests) · 7-day `maxAge`.
The cookie holds a random 32-byte token; the server holds the truth, so signing out ends the session for real.

## Ownership: scoped queries

`getOrdersFor(user.id)` (`orders/page.js:24`) takes the id from the session. There is no id in the request that could ask for someone else's orders.

## The attacks, and the line that stopped each

> Fill in the "What I saw" column from your own run, on the DEPLOYED site. Do not leave it as written here.

| # | Attack | Stopped by | What I saw |
|---|--------|------------|------------|
| 1 | `cancelOrder` signed out | Page route: proxy redirect (layer 1). The action itself: `actions.js:80` returns "Not signed in" | _fill in_ |
| 2 | `cancelOrder` with another account's order id | `actions.js:84` — refused on ownership, not on session | _fill in_ |
| 3 | `/login?next=https://example.com` | `safeNext.js:7`: must start with ONE slash. Falls back to `/menu` in this app | _fill in_ |
| 4 | Another account's id in `/orders/[id]` | `orders/[id]/page.js:24` → 404 (same as a missing order) | _fill in_ |
| 5 | Another account's id in `GET /api/orders/[id]` | `api/orders/[id]/route.js:14` → 403 | _fill in_ |
| 6 | A customer calls `advanceOrder` | `actions.js:97` → "Not allowed" | _fill in_ |

How to run 2 and 6 (a server action is not callable by name from the console): sign in as account A, open DevTools > Network, click Cancel on a PENDING order, copy that request as cURL. Replay it with account B's `session` cookie. Record the response you actually get. For attack 1, replay it with no cookie to a path the proxy does not cover, or note that the proxy refused it first.

Expected result for 3: the person lands on `/menu` (the app's fallback), never on example.com. (The slide's example lands on `/` because it is a different app.)

## Known gaps (stated, not hidden)

- The app uses a mock in-memory store by default (`db.js`) with optional Redis-backed persistence via `src/lib/persist.js`. If Redis is not configured, accounts, sessions and orders still reset when the server process restarts. See README, "Deploying".
- `POST /api/orders` is for outside callers and does not rebuild line items or prices from the dish list; the UI uses `placeOrder`, which does.
- No rate limiting, password reset or social sign-in.
