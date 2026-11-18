namespace AddisEats.Menu;

// Mr. Ephrem Tesfaye's LINQ examples, un-commented and numbered, with a few lines added.
public static class LinqTour
{
    public static void Run(List<MenuItem> myMenuItems)
    {
        // 1. WHERE: keep the items that match
        var foodItems = myMenuItems.Where(i => i.Category == "Food");
        Console.WriteLine("1. Where (Category is Food)");
        foreach (var item in foodItems)
        {
            Console.WriteLine($"   Food Item Name: {item.Name}");
        }

        // 2. SELECT: turn each item into something else (here, just its price)
        var prices = myMenuItems.Select(i => i.Price).ToList();
        Console.WriteLine("2. Select (the prices only)");
        foreach (var price in prices)
        {
            Console.WriteLine($"   Price: {price:N2} ETB");
        }

        // 3. ANY: is at least one item a match?
        bool hasExpensiveItems = myMenuItems.Any(i => i.Price > 10.0m);
        Console.WriteLine($"3. Any: has expensive items: {hasExpensiveItems}");

        // 4. ALL: is every item a match?
        bool allItemsAreExpensive = myMenuItems.All(i => i.Price > 10.0m);
        Console.WriteLine($"4. All: all items are expensive: {allItemsAreExpensive}");

        // 5. FIRSTORDEFAULT: one item, or null when nothing matches
        var d = myMenuItems.FirstOrDefault(i => i.Price > 20.0m);
        if (d != null)
        {
            Console.WriteLine($"5. First item with price greater than 20.0: {d.Name}");
        }
        else
        {
            Console.WriteLine("5. No item found with price greater than 20.0");
        }

        // 5b. The teacher's version added "?? throw ..." after FirstOrDefault. That turns
        //     "no match" into an exception, so the else branch above could never run.
        //     Fine when a missing item is a real error, as long as somebody catches it.
        try
        {
            var mustExist = myMenuItems.FirstOrDefault(i => i.Price > 20.0m)
                ?? throw new InvalidOperationException("No item found with price greater than 20.0");
            Console.WriteLine($"5b. Found: {mustExist.Name}");
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine($"5b. Caught: {ex.Message}");
        }

        // 6. ORDERBY and ORDERBYDESCENDING
        Console.WriteLine("6. OrderBy (cheapest first)");
        var orderedByPrice = myMenuItems.OrderBy(i => i.Price).ToList();
        foreach (var item in orderedByPrice)
        {
            Console.WriteLine($"   {item.Name,-10}{item.Price,8:N2} ETB");
        }

        Console.WriteLine("   OrderByDescending (dearest first)");
        var orderedByDesPrice = myMenuItems.OrderByDescending(i => i.Price).ToList();
        foreach (var item in orderedByDesPrice)
        {
            Console.WriteLine($"   {item.Name,-10}{item.Price,8:N2} ETB");
        }

        // 7. SKIP and TAKE: skip 3 items, then take the next 4
        var theLast4Items = myMenuItems.Skip(3).Take(4).ToList();
        Console.WriteLine($"7. Skip(3).Take(4): {theLast4Items.Count} items: {string.Join(", ", theLast4Items.Select(i => i.Name))}");

        // 8. SUM and AVERAGE
        var sumOfPrices = myMenuItems.Sum(i => i.Price);
        var averageOfPrices = myMenuItems.Average(i => i.Price);
        Console.WriteLine($"8. Sum of prices: {sumOfPrices:N2} ETB, average of prices: {averageOfPrices:N2} ETB");

        // 9. COUNT and MAX (added)
        int foodCount = myMenuItems.Count(i => i.Category == "Food");
        decimal mostExpensive = myMenuItems.Max(i => i.Price);
        Console.WriteLine($"9. Count of Food items: {foodCount}, highest price: {mostExpensive:N2} ETB");

        // 10. PAGING (added): always order BEFORE you skip and take
        Console.WriteLine("10. Paging, 3 per page, ordered by Id");
        const int pageSize = 3;
        for (int page = 1; page <= 3; page++)
        {
            var names = myMenuItems
                .OrderBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(i => i.Name);
            Console.WriteLine($"   Page {page}: {string.Join(", ", names)}");
        }
    }
}
