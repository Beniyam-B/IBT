namespace AddisEats.Ordering;

public class OrderBook
{
    public const int PageSize = 5;

    private readonly List<Order> _orders;

    public OrderBook(IEnumerable<Order>? orders = null)
    {
        _orders = orders?.ToList() ?? new List<Order>();
    }

    public void Add(Order order) => _orders.Add(order);

    // Orders for one area, biggest total first.
    public IReadOnlyList<Order> ForArea(string area) =>
        _orders
            .Where(o => o.Area.Equals(area, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(o => o.Total)
            .ToList();

    // Sum on an empty list is 0, so this never throws.
    public decimal TotalRevenue() => _orders.Sum(o => o.Total);

    // The category with the most units ordered, or null when there are no orders (FirstOrDefault does not throw).
    public string? BusiestCategory() =>
        _orders
            .SelectMany(o => o.Lines)
            .GroupBy(l => l.Item.Category)
            .OrderByDescending(g => g.Sum(l => l.Quantity))
            .ThenBy(g => g.Key)
            .Select(g => g.Key)
            .FirstOrDefault();

    // Page 1, 2, 3... at five per page. Always ordered first, with Id as a tie-breaker, so pages never overlap.
    public IReadOnlyList<Order> Page(int page)
    {
        if (page < 1)
        {
            throw new ArgumentException("Page must be 1 or more.", nameof(page));
        }

        return _orders
            .OrderByDescending(o => o.PlacedOn)
            .ThenBy(o => o.Id)
            .Skip((page - 1) * PageSize)
            .Take(PageSize)
            .ToList();
    }
}
