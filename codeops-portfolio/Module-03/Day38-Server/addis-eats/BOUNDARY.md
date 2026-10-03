# Component Boundaries — Addis Eats

| Component                          | Runs on | Why                                                      |
|--------------------------------------|---------|-------------------------------------------------------------|
| app/layout.js                        | Server  | Passes children into Providers, imports nothing client      |
| app/providers.jsx                    | Client  | Holds cart state via context                                 |
| app/menu/page.js                     | Server  | No interactivity of its own, wraps content                   |
| app/menu/layout.js                   | Server  | Just composes CategoryBar + children, no state itself        |
| app/menu/CategoryBar.jsx             | Client  | Holds selected category and handles clicks                   |
| app/menu/FilterShell.jsx             | Client  | Holds search input state                                     |
| app/menu/DishList.jsx                | Server  | Fetches dishes directly, pure markup, ships no JavaScript     |
| app/menu/[id]/page.js                | Server  | Fetches a single dish, no interactivity of its own            |
| app/menu/[id]/DishCard.jsx           | Server  | Pure markup from data                                         |
| app/menu/[id]/AddToCartButton.jsx    | Client  | onClick, writes to the cart context                           |

## Bundle size for /menu

Before (Day 37 baseline): <paste First Load JS from the build before today's changes>
After (Day 38): <paste First Load JS from the build after today's changes>

Note: Providers and AddToCartButton add a small amount of client JS, but DishList and DishCard still ship zero JavaScript — the increase should stay in the low kilobytes, not scale with the number of dishes.
