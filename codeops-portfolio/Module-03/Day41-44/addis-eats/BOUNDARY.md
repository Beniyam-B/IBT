# Component Boundaries — Addis Eats

Ten client components in the whole application, none of them a page. Everything else is a server component.

| Component                                | Runs on | Why                                                                         |
|------------------------------------------|---------|--------------------------------------------------------------------------------|
| src/app/layout.js                        | Server  | Passes children into Providers; imports Header/Footer (server) and Providers   |
| src/app/providers.jsx                    | **Client** | Cart context (state, localStorage) and who is signed in (one fetch of `/api/session` per page change) |
| src/components/Header.jsx, Footer.jsx    | Server  | Plain markup and links                                                          |
| src/components/HeaderNav.jsx             | **Client** | Active link (usePathname); shows Cart, Checkout, Orders only to a signed-in user |
| src/components/DishImage.jsx             | Server  | Shows the photo path from db.js, or a placeholder letter. No directive, so the client can reuse it |
| src/app/page.js (home)                   | Server  | Awaits dishes from the API                                                      |
| src/app/menu/layout.js                   | Server  | Loads the categories from the API; passes them to CategoryBar                   |
| src/app/menu/CategoryBar.jsx             | **Client** | `useSearchParams` to highlight the active category (URL is the state)        |
| src/app/menu/page.js                     | Server  | Static (ISR); renders page 1 and its pager on the server                        |
| src/app/menu/MenuBrowser.jsx             | **Client** | Debounced search box, SWR for results and later pages; receives the server-rendered first page as **children** |
| src/app/menu/DishList.jsx, Pager.jsx, DishItem.jsx | Server (shared) | Pure markup, no directive: rendered on the server for page 1, reused by the client for results |
| src/app/menu/AddToCartButton.jsx         | **Client** | onClick writes to the cart; signed-out visitors get a "Log in to order" link |
| src/app/menu/error.js                    | **Client** | Required: the retry button needs an event handler                            |
| src/app/menu/[id]/page.js                | Server  | Awaits params and the dish, calls `notFound()`                                  |
| src/app/menu/[id]/DishCard.jsx           | Server  | Markup from data; imports the client AddToCartButton                            |
| src/app/cart/page.js                     | Server  | Heading only                                                                    |
| src/app/cart/CartView.jsx                | **Client** | Reads and edits the cart (private to this tab)                               |
| src/app/checkout/page.js                 | Server  | Session guard + reads `?dish=`, redirects when signed out                       |
| src/app/checkout/CheckoutForm.jsx        | **Client** | `useActionState` is a hook                                                   |
| src/app/login/page.js, register/page.js  | Server  | Static shells                                                                   |
| src/components/AuthForm.jsx              | **Client** | One shared `useActionState` form for both screens                            |
| src/app/orders/page.js                   | Server  | Reads the session and orders; cancel is a plain `<form action={cancelOrder.bind(null, id)}>`, no client code |
| src/app/orders/[id]/page.js              | Server  | Reads the session and the order; passes the order to the poll as starting data  |
| src/app/kitchen/page.js                  | Server  | Staff only: verifies the session and the role; the buttons are forms bound to `advanceOrder` |
| src/proxy.js                             | Server (before render) | Cookie check and redirect for the private routes, with a narrow matcher |
| src/app/orders/OrderStatus.jsx           | **Client** | `useSWR` polls `/api/orders/[id]` every 5 s; `fallbackData` = the server's order |
| src/app/actions.js                       | Server  | `"use server"`; session, role and ownership are checked inside each action     |
| src/lib/db.js, schema.js, images.js      | Server  | Data layer (dishes API + in-memory users, hashed passwords, sessions, orders), zod schemas, photo lookup |
| src/lib/session.js, safeNext.js, auth-config.js | Server | `getSession()` used by pages, actions and handlers; the open-redirect guard; the cookie name |
| src/lib/fetcher.js, useDebounce.js       | Shared  | No directive: used only by client components                                    |

## Composition pairs (client wrapping server content)

- `page.js` (server) → `MenuBrowser` (client) receives the first page of dishes as **children**; `DishList` is never imported by it. The same element is also the Suspense **fallback**, so the static HTML contains the dishes even before the client runs.
- `layout.js` (server) → `Providers` (client) receives Header, the page and Footer as **children**.
- `DishCard` and `DishItem` (server-capable) **import** the client `AddToCartButton` — a server component importing a client one is always allowed.

## What cannot cross the boundary here

Props passed server → client are all serialisable: `categories`, `pageSize`, `initial` (the order object), `dish = { id, name, price, image }`. No callbacks are passed; the cart actions come from `useCart()` inside client files.

## Bundle size (First Load JS, gzip, from `node scripts/first-load-js.mjs`)

| Route    | Day 40 | Day 41 | Day 42 |
|----------|--------|--------|--------|
| /menu    | 180.3 kB | 187.1 kB | **187.2 kB** |
| /        | 178.8 kB | 179.0 kB | 179.1 kB |
| /orders  | 173.4 kB | 173.5 kB | 173.6 kB |

Day 42 added almost nothing to the bundle: the proxy, the session helper and bcrypt run on the server. (Putting the session query into SWR would have added about 5 kB to *every* route, because it would have been loaded by the root layout, so it is a plain fetch.)

`/menu` grew by about 7 kB on Day 41: that is SWR plus the search/paging component, and it is the price of search and paging without a request per keystroke. The dish list, the dish pages and the home page still ship no JavaScript of their own. `/orders/[id]` loads SWR too, only on that route. Day 35 (Vite) baseline: `<paste the gzip total from the Vite build>`.
