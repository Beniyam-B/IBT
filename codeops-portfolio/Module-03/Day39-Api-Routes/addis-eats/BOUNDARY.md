# Component Boundaries — Addis Eats

| Component                             | Runs on | Why                                                        |
|---------------------------------------|---------|--------------------------------------------------------------|
| src/app/layout.js                     | Server  | Passes children into Providers, imports nothing client        |
| src/app/providers.jsx                 | Client  | Holds cart state via context                                  |
| src/app/Header.jsx, Footer.jsx        | Server  | Plain markup and links, no state                              |
| src/app/menu/layout.js                | Server  | Composes CategoryBar and children                             |
| src/app/menu/CategoryBar.jsx          | Client  | useSearchParams to bold the active category                   |
| src/app/menu/FilterShell.jsx          | Client  | Holds the search input and updates ?q= in the URL             |
| src/app/menu/page.js                  | Server  | Reads searchParams and passes them to DishList                |
| src/app/menu/DishList.jsx             | Server  | Reads db.js and filters; ships no JavaScript                  |
| src/app/menu/[id]/page.js             | Server  | Fetches one dish                                              |
| src/app/menu/[id]/DishCard.jsx        | Server  | Markup from data                                              |
| src/app/menu/[id]/AddToCartButton.jsx | Client  | onClick writes to the cart context                            |
| src/app/checkout/page.js              | Client  | useActionState needs the browser                              |
| src/app/login/page.js, register/page.js | Client | Controlled form inputs                                       |
| src/app/actions.js                    | Server  | "use server": placeOrder and cancelOrder, checks run inside   |
| src/lib/db.js, schema.js              | Server  | Mock data layer and zod schemas                               |

## Bundle size for /menu

Day 37 baseline: <paste First Load JS>
Now: <paste First Load JS>

Note: DishList and DishCard ship no JavaScript. The client islands are small and do not grow with the number of dishes.
