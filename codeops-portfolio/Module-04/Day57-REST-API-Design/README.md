# AddisEats.Api (Day 57): the written API design

This README is the design for the Addis Eats API: its route table, its error catalogue and the decisions behind them. The code is brought into line with it.

## Run it
## Route table

All paths are versioned under `/api/v1`. The failure column lists every status an endpoint can return; the error codes are in the catalogue below. 401 and 403 are added with authentication on Day 63, and 500 is only for genuine server faults.

| # | Method | Path | Purpose | Success | Failure |
|---|--------|------|---------|---------|---------|
| 1 | GET | `/api/v1/restaurants` | List restaurants, filtered and paged | 200 | 400 |
| 2 | GET | `/api/v1/restaurants/{id}` | Read one restaurant | 200 | 404 |
| 3 | GET | `/api/v1/restaurants/{id}/menu` | That restaurant's menu, paged | 200 | 400, 404 |
| 4 | GET | `/api/v1/menu-items` | The whole menu, filtered and paged | 200 | 400 |
| 5 | GET | `/api/v1/menu-items/{id}` | Read one menu item | 200 | 404 |
| 6 | POST | `/api/v1/menu-items` | Create a menu item | 201 | 400, 422 |
| 7 | POST | `/api/v1/orders` | Place an order | 201 | 400, 404, 409, 422 |
| 8 | GET | `/api/v1/orders/{id}` | Read one order | 200 | 404 |
| 9 | PATCH | `/api/v1/orders/{id}/status` | Move an order forward | 200 | 400, 404, 409 |
| 10 | DELETE | `/api/v1/orders/{id}` | Cancel an order | 204 | 404, 409 |

## Status code rules
- **200** a read succeeded, or an update returned the changed resource. An empty collection is still a 200 with an empty `data` array.
- **201** a resource was created, always with a `Location` header (`CreatedAtAction`).
- **204** it worked and there is nothing to say: no body at all (cancelling an order).
- **400** the request could not be understood (malformed body, bad type, bad paging, unknown parameter).
- **404** that resource does not exist.
- **409** the request is fine but clashes with the current state (closed restaurant, a move the order cannot make).
- **422** the request is well formed but breaks a business rule (a quantity of 0, an item that is not on that restaurant's menu).
- **500** our code threw and nobody caught it. Never returned for input the caller got wrong.

## Identifiers and filters

An identifier selects one thing, so it belongs in the path. A filter changes which subset comes back, so it belongs in the query string.

| Segment | Kind | Where it lives |
|---|---|---|
| `/api/v1` | version prefix | path |
| `restaurants`, `menu-items`, `orders` | collection (plural noun) | path |
| `{id}` | identifier | path, constrained with `:int` |
| `menu` in `restaurants/{id}/menu` | sub-resource of a restaurant | path |
| `status` in `orders/{id}/status` | sub-resource of an order | path |
| `area`, `areas`, `maxFeeEtb`, `category`, `maxPrice` | filters | query string |
| `page`, `limit` | paging controls | query string |

What I changed:
1. `/api/v1/menu` became `/api/v1/menu-items`, so the collection is a plural, hyphenated noun like the others.
2. Nothing else needed moving: no identifier is passed in the query string, and no filter is in the path (`/restaurants?area=Bole`, not `/restaurants/bole`).
3. The deepest path is two levels (`restaurants/{id}/menu`). Reaching one restaurant's items another way would use a filter on `/menu-items`, not a longer path.

## Verbs in paths

I scanned every route for create, get, update, list, fetch, do, cancel and lookup. The final route table has **no verb in any path**. Two operations tempted one, so here is each written three ways.

**Cancelling an order**

| Way | Route | Verdict |
|---|---|---|
| 1. Use the method that already exists | `DELETE /api/v1/orders/91` | chosen |
| 2. Model the state as a sub-resource | `PATCH /api/v1/orders/91/status` with `{ "status": "Cancelled" }` | works, but gives two ways to cancel |
| 3. Model the event as a resource | `POST /api/v1/orders/91/cancellations` | useful only if cancellations need a stored reason |

Chosen: way 1. DELETE exists for this, it is idempotent (cancelling twice is not an error), and it gives the API its 204. `PATCH` moves an order forward only, so there is exactly one way to cancel.

**Finding a restaurant by name** (the `lookup` routes from the Day 56 experiment, now removed)

| Way | Route | Verdict |
|---|---|---|
| 1. A filter | `GET /api/v1/restaurants?name=yod` | chosen |
| 2. An identifier | `GET /api/v1/restaurants/yod-abyssinia` | needs a unique slug |
| 3. A named verb | `GET /api/v1/restaurants/search?q=yod` | last resort |

Chosen: way 1. Finding is filtering a collection, and a filter in the query string keeps the path a noun.

No named-verb route remains. Login, which resists this, arrives on Day 63 and will be written as `POST /api/v1/auth/login` with that reason documented.
