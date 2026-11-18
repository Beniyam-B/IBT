# Day 53: Addis Eats Order Book

Console app (.NET 10) that holds a menu, places orders against it and reports on them.

## Types (each in its own file, namespace `AddisEats.Ordering`)
- `MenuItem` (record): id, name, category, price. Price must be greater than 0.
- `OrderLine` (record): a menu item and a quantity. Quantity must be greater than 0.
- `Order` (class): customer, area, time, lines, and a computed `Total`.
- `OrderBook` (class): holds the orders and answers questions about them.

## OrderBook queries (all LINQ, no loops)
- `ForArea(area)`: orders for one area, biggest total first.
- `TotalRevenue()`: total ETB across all orders.
- `BusiestCategory()`: category with the most units ordered, or null when empty.
- `Page(n)`: page n at five per page, newest first, ordered before paging so pages never overlap.

All money values are `decimal`.

## Run it
```
cd AddisEats.OrderBook
dotnet run
```

`AddisEats.Menu` is the in-class menu service this project extends.