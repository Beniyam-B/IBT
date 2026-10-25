# Component Boundaries — Addis Eats

Eight client components in the whole application, none of them a page. Everything else is a server component.

| Component                                | Runs on | Why                                                                         |
|------------------------------------------|---------|--------------------------------------------------------------------------------|
| src/app/layout.js                        | Server  | Passes children into Providers; imports Header/Footer (server) and Providers   |
| src/app/providers.jsx                    | **Client** | Cart context needs state and localStorage                                  |
| src/components/Header.jsx, Footer.jsx    | Server  | Plain markup and links                                                          |
| src/components/HeaderNav.jsx             | **Client** | Cart count (context), active link (usePathname), signed-in user (fetch)      |
| src/components/DishImage.jsx             | Server  | Shows the photo path from db.js (found by dish name with `fs`) or a placeholder; ships no JS |
| src/app/page.js (home)                   | Server  | Awaits dishes from db.js                                                        |
| src/app/menu/layout.js                   | Server  | Passes its children into MenuShell                                              |
| src/app/menu/MenuShell.jsx               | **Client** | Owns the category + search state; filters the cards it receives as children  |
| src/app/menu/page.js                     | Server  | Static (ISR); wraps DishList in Suspense                                        |
| src/app/menu/DishList.jsx                | Server  | Async: awaits dishes, pure markup                                               |
| src/app/menu/AddToCartButton.jsx         | **Client** | onClick writes to the cart context                                           |
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
| src/app/actions.js                       | Server  | `"use server"`; every check lives inside the action                             |
| src/lib/db.js, schema.js, images.js      | Server  | Mock data layer, zod schemas, image path helper                                 |

## Composition pairs (client wrapping server content)

- `menu/layout.js` (server) → `MenuShell` (client) receives the page as **children**; `DishList` is never imported by it and stays on the server.
- `layout.js` (server) → `Providers` (client) receives Header, the page and Footer as **children**.
- `DishCard` (server) **imports** the client `AddToCartButton` — a server component importing a client one is always allowed.

## What cannot cross the boundary here

Props passed server → client are all serialisable: `dish = { id, name, price, image }`, `quick`, `defaultName`. No callbacks are passed; the cart actions come from `useCart()` inside the client files, and server actions are the one function that may cross.

## Bundle size for /menu

Measured with `node scripts/first-load-js.mjs` after `npm run build` (gzip):

- Day 35 (Vite) /menu: `<paste the gzip total from the Vite build>`
- Today /menu: **180.3 kB**; a page with no client islands of its own (/orders) is 173.4 kB, so the menu adds about 7 kB. The dish list, dish cards, home page and every dish page ship no JavaScript of their own.
