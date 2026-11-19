
# AddisEats.Api (Day 54): the menu API

ASP.NET Core Web API (.NET 10) with controllers, dependency injection, options bound from `appsettings.json`, and Swagger. The menu is held in memory in `SeedData`, so added items are lost when the app restarts.

## Endpoints

| Method | Path | Success | Failure |
|---|---|---|---|
| GET | `/api/v1/menu?category=&maxPrice=&page=&limit=` | 200 with a page of menu items | 400 if page or limit is out of range |
| GET | `/api/v1/menu/{id}` | 200 with one menu item | 404 if the id does not exist |
| POST | `/api/v1/menu` | 201 with the new item and a `Location` header | 400 if name or category is missing, or the price is 0 or less |

## Folders
- `Models`: the `MenuItem` class
- `Dtos`: `CreateMenuItemDto`, the body of the POST
- `Data`: `SeedData`, the twelve starting menu items
- `Services/MenuServices`: `IMenuService` and `MenuService`, registered with `AddScoped`
- `Options`: `MenuOptions`, bound from the `Menu` section of `appsettings.json`
- `Controllers`: `MenuController`

## Configuration
- `Menu:DefaultPageSize` is used when `limit` is not sent.
- `Menu:MaxPriceEtb` is the price ceiling used when `maxPrice` is not sent.

All ETB amounts are `decimal`.

## Run it