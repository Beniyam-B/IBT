# DATA.md — Every client query: key, refresh rule, and why

Rule used throughout: server first. Only fetching that is triggered by the person, or repeated on a
schedule, stays in the browser. Everything below is SWR (`useSWR`) with the shared fetcher in
`src/lib/fetcher.js`, which throws on a non-2xx response so `error` is set for 401, 403, 404 and 500.

## Queries

| Query | Key | Refresh rule | Why |
|-------|-----|--------------|-----|
| Order status (`OrderStatus.jsx`) | `/api/orders/${id}` | `refreshInterval`: 5000 ms while the order is PENDING, PREPARING or ON THE WAY; **0 once DELIVERED or CANCELLED**. `fallbackData` = the order the server already rendered. Focus and reconnect revalidation left on (default) | The status changes while the page is open, so it must be polled. Stopping at a final status avoids requests that can never return anything new. `fallbackData` means the first paint shows real data and never a spinner |
| Menu results (`MenuBrowser.jsx`) | `/api/dishes?page=2&pageSize=8` plus `&q=` and `&category=` when set. **`null` in the default view** | No polling. `keepPreviousData: true`. Focus revalidation left on (default): the menu barely changes, so it is harmless | Search, category and later pages are triggered by the person. The default view (no search, all categories, page 1) is rendered by the server, so the key is `null` and no request is sent. `keepPreviousData` keeps the old list on screen while the next one loads, so it never flashes empty |

## Supporting rules for the menu query

- **Debounce:** the search box is local state. The URL (`?q=`) is only updated after typing pauses for 300 ms (`useDebounce`), and the SWR key is built from the URL. Typing "tibs" sends one request, not four.
- **The URL is the state:** `?q=`, `?category=` and `?page=` are in the query string, so any result can be linked to and the back button works. Changing the search resets the page to 1.
- **Race safety:** the key identifies the request, so the list shown always matches the current key. A slow response for "tib" cannot overwrite the list for "tibs".
- **Deduplication:** two components using the same key share one request (SWR default, 2 s window).
- **Page one is the server's:** `/menu` is static (ISR 1 h) and renders page 1 with its pager as plain HTML, so it is fast and indexable and works without JavaScript.

## Server-side data (not a client query)

| Data | How | Rule | Why |
|------|-----|------|-----|
| The dishes (public JSON API) | `fetch(url, { next: { revalidate: 3600 } })` in `src/lib/db.js` | Cached for one hour; **falls back to a bundled copy** (`dishes.fallback.json`) if the API cannot be reached | The menu is the same for everyone and changes rarely. The fallback keeps the app working on a bad connection |

## Deliberately not a client query

- Menu on arrival, dish detail, the home page: server components (indexable, no client fetch at all).
- Placing and cancelling an order: server actions. They are writes from our own UI, not queries.
- Who is signed in: one small `fetch` of `/api/session` per page change, in `Providers` (shared by the header and every Add-to-cart button). It could be `useSWR("/api/session", fetcher)`, but that would put SWR in the root layout and load it on every route (about 5 kB more everywhere), for one tiny request with no polling.

## If this were TanStack Query instead

- Order status: `queryKey: ["orders", id]`, `staleTime: 0` (always refetch), `refetchInterval` like the SWR rule above, `initialData` from the server.
- Menu results: `queryKey: ["dishes", { q, category, page }]`, `staleTime: 5 * 60_000` (a menu barely changes), `placeholderData: keepPreviousData`.
- After placing an order: `invalidateQueries({ queryKey: ["orders"] })`, the browser-side counterpart of `revalidatePath("/orders")`.
- I used SWR because the client side is one poll and one search box; there are no client-side writes to invalidate.
