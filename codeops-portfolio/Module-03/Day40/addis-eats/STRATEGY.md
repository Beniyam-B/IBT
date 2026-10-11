# Rendering Strategy — Addis Eats

Question asked of every route: *does it depend on who is asking, and how stale may it be?*

| Route              | Strategy                          | One line of reasoning                                                              |
|--------------------|-----------------------------------|--------------------------------------------------------------------------------------|
| /                  | Static                            | Nobody in particular is asking; the story and popular dishes only change on a rebuild |
| /menu              | ISR, revalidate = 3600            | Dishes change a few times a day; an hour old is fine and speed matters most. Filters run client-side over the static HTML, so no searchParams read |
| /menu/[id]         | Static via generateStaticParams   | Every dish id is known at build time; `dynamicParams = false` gives a real 404 for the rest |
| /cart              | Client                            | The cart is private to this browser tab and never leaves it until checkout          |
| /checkout          | Dynamic                           | Reads the session cookie to guard the page (redirects to /login); also reads `?dish=` |
| /login, /register  | Static shell, server actions      | The page is identical for everyone; the actions do the work on submit                |
| /orders            | Dynamic                           | One person's orders, read from the session cookie: never cacheable                   |
| /api/dishes, /api/dishes/[id] | Route handler (GET)    | Read-only data for callers outside my pages                                          |
| /api/orders        | Route handler (POST)              | Writes are never cached; validated server-side                                       |
| /api/session       | Route handler (GET)               | Reads the cookie; lets the static header know who is signed in                       |

## Build output (production build)

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
│ ├ ● /menu/dish_1
│ ├ ● /menu/dish_2
│ ├ ● /menu/dish_3
│ └ ● /menu/dish_4
├ ƒ /orders
└ ○ /register

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

Every marker above matches the table: `/` ○, `/menu` ○ with a 1 h revalidate, `/menu/[id]` ●, `/cart` ○ (client state), `/checkout` ƒ, `/orders` ƒ.

## Routes where the written intent changed

- **/menu** — I first wrote "dynamic" because the filters lived in `?q=` and `?category=`; reading `searchParams` is what made it ƒ. Once I asked "how stale may it be?" the answer was "an hour", so the filter state moved into a client shell and the route became ISR.
- **/checkout** — I first wrote "static shell" because the checks were all in the action. A guard that redirects before rendering needs the session cookie, which makes the route dynamic, and that is correct.

## Why the header does not read the session itself

`cookies()` anywhere in a route opts the whole route out of static. If the root layout read the session, every route would turn ƒ. Instead the header is static and one small client island asks `GET /api/session` who is signed in, which keeps `/`, `/cart`, `/login`, `/register` and every dish page static.
