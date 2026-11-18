namespace AddisEats.Menu;

public class MenuService
{
    private readonly List<MenuItem> _items = new();

    public int Count => _items.Count;

    // Refuse bad data at the door: a price of zero or less is the caller's mistake.
    public void Add(MenuItem item)
    {
        if (item.Price <= 0m)
        {
            throw new ArgumentException("Price must be greater than zero.", nameof(item));
        }

        _items.Add(item);
    }

    // Every item in one category, cheapest first. LINQ, no loop.
    public IReadOnlyList<MenuItem> InCategory(string category) =>
        _items
            .Where(i => SameCategory(i, category))
            .OrderBy(i => i.Price)
            .ToList();

    // Total and average for a category. An empty category gives zeros instead of an exception.
    public CategoryStats StatsFor(string category)
    {
        var prices = _items
            .Where(i => SameCategory(i, category))
            .Select(i => i.Price)
            .ToList();

        if (!prices.Any())
        {
            return new CategoryStats(0, 0m, 0m);
        }

        return new CategoryStats(prices.Count, prices.Sum(), prices.Average());
    }

    private static bool SameCategory(MenuItem item, string category) =>
        item.Category.Equals(category, StringComparison.OrdinalIgnoreCase);
}
