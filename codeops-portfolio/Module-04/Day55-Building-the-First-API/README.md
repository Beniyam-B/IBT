cd L:\IBT\codeops-portfolio\Module-04\Day55-Building-the-First-API\AddisEats.Api
@'
# AddisEats.Api (Day 55): restaurants and menus

ASP.NET Core Web API (.NET 10). Restaurants and menu items are held in memory in `SeedData`: 32 restaurants across four areas of Addis Ababa (Bole, Ayat, Mexico, Megenagna), six menu items each. Added menu items are lost when the app restarts.

## Endpoints

| Method | Path | Query parameters | Success | Failure |
|---|---|---|---|---|
| GET | `/api/v1/restaurants` | `area`, `page` (default 1), `limit` (default 20, max 50) | 200 `{ data, page, pageSize, total }` | 400 if page is below 1 or limit is outside 1 to 50 |
| GET | `/api/v1/restaurants/{id}` | | 200 with one restaurant | 404 if the id does not exist |
| GET | `/api/v1/restaurants/{id}/menu` | `category` | 200 with the menu (an empty array if nothing matches) | 404 if the restaurant does not exist |
| GET | `/api/v1/menu` | `category`, `maxPrice`, `page`, `limit` | 200 `{ data, page, pageSize }` | 400 if page or limit is out of range |
| GET | `/api/v1/menu/{id}` | | 200 with one menu item | 404 if the id does not exist |
| POST | `/api/v1/menu` | | 201 with a `Location` header | 400 if name or category is missing, or the price is 0 or less |

`POST /api/v1/menu` creates an item that is not attached to a restaurant yet (`restaurantId` 0).

## Design notes
- No entity is returned from any endpoint: services work with entities and controllers map to DTOs (`RestaurantDto` omits `OwnerAddress`).
- A 404 means the thing asked about does not exist. A 200 with `[]` means it exists but nothing matches.
- All ETB amounts are `decimal`.
- CORS allows `http://localhost:5173` and `http://localhost:3000`.

## Folders
- `Controllers`: HTTP only
- `Services/RestaurantServices`, `Services/MenuServices`: the rules, behind interfaces registered with `AddScoped`
- `Models`: the entities
- `Dtos`: what HTTP sees
- `Mappers`: entity to DTO extension methods
- `Data`: `SeedData`
- `Options`: `MenuOptions`, bound from `appsettings.json`

## Run it