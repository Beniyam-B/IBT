# AddisEats.Api (Day 56): routing, controllers and orders

ASP.NET Core Web API (.NET 10) with restaurants, menus and orders. Data is held in memory in `SeedData` (32 restaurants in four areas, six menu items each, two starting orders), so changes are lost when the app restarts.

## Route table

Every id segment is constrained with `:int`: a non-numeric id (for example `/restaurants/abc`) matches no route and returns 404.

| Verb | Route | Constraints | Query parameters | Success | Failure |
|---|---|---|---|---|---|
| GET | `/api/v1/restaurants` | none | `area`, `areas` (repeat the key), `maxFeeEtb`, `page` (default 1), `limit` (default 20, max 50) | 200 envelope | 400 for a bad page or limit, or a non-numeric value |
| GET | `/api/v1/restaurants/{id}` | `id:int` | | 200 `RestaurantDto` | 404 |
| GET | `/api/v1/restaurants/{id}/menu` | `id:int` | `category` | 200 envelope (empty `data` when nothing matches) | 404 if the restaurant does not exist |
| GET | `/api/v1/menu` | none | `category`, `maxPrice`, `page`, `limit` | 200 envelope | 400 for a bad page or limit |
| GET | `/api/v1/menu/{id}` | `id:int` | | 200 `MenuItemDto` | 404 |
| POST | `/api/v1/menu` | none | | 201 with `Location` | 400 |
| GET | `/api/v1/orders/{id}` | `id:int` | | 200 `OrderDto` | 404 |
| POST | `/api/v1/orders` | none | | 201 with `Location` | 400 if quantity is 0 or less, the restaurant is closed or unknown, or the item is not on its menu |
| PATCH | `/api/v1/orders/{id}/status` | `id:int` | | 200 `OrderDto` | 400 unknown status, 404 no such order, 409 move not allowed |

Allowed status moves: Placed to Preparing or Cancelled; Preparing to OnTheWay or Cancelled; OnTheWay to Delivered. Delivered and Cancelled are final.

## Responses
- Every collection uses one envelope: `{ "data": [...], "page": 1, "pageSize": 20, "total": 32 }`.
- JSON is camelCase, null fields are omitted, and enums are strings (`"status": "Placed"`).
- `RestaurantQuery` is bound with `[FromQuery]`. Filters are nullable (`maxFeeEtb`) or lists that default to empty (`areas`), so "not supplied" is different from 0.
- All ETB amounts are `decimal`.

## Exercise 5: route ambiguity
Two actions with the identical route `lookup/{key}` and `lookup/{name}` produced this:


{{AMBIGUITY}}


Fixed twice: with a constraint (`lookup/{key:int}` against `lookup/{name}`) and with distinct literal paths (`lookup/by-key/{key}` against `lookup/by-name/{name}`). The experiment code has been removed.

## Run it