using System.Globalization;
using AddisEats.Ordering;

CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;

// The in-class menu: the teacher's seven items plus the Cake.
var menu = new List<MenuItem>
{
    new(1, "Burger", "Food", 10.5m),
    new(2, "Pizza", "Food", 15.0m),
    new(3, "Coke", "Drink", 2.5m),
    new(4, "Water", "Drink", 1.0m),
    new(5, "Salad", "Food", 8.0m),
    new(6, "Fries", "Food", 3.5m),
    new(7, "Ice Cream", "Dessert", 4.0m),
    new(8, "Cake", "Dessert", 6.0m)
};

var t0 = new DateTime(2026, 11, 1, 9, 0, 0);

OrderLine Line(int itemId, int qty) => new OrderLine(menu.First(m => m.Id == itemId), qty);
Order Make(int id, string customer, string area, params OrderLine[] lines) =>
    new Order(id, customer, area, t0.AddHours(id), lines);

// Worked start: one hard-coded order, end to end.
var first = Make(1, "Almaz", "Bole", Line(1, 2), Line(3, 2));
Console.WriteLine($"Order {first.Id} for {first.Customer} ({first.Area}): {first.Total:N2} ETB");
Console.WriteLine(string.Join(Environment.NewLine, first.Lines.Select(l => $"  {l.Quantity} x {l.Item.Name,-10}{l.LineTotal,8:N2}")));

var book = new OrderBook(new[]
{
    first,
    Make(2, "Dawit", "Piassa", Line(2, 1), Line(4, 1)),
    Make(3, "Tigist", "Bole", Line(2, 3), Line(6, 2)),
    Make(4, "Hana", "Kazanchis", Line(5, 1), Line(7, 2)),
    Make(5, "Samuel", "Bole", Line(1, 1), Line(3, 3), Line(8, 1)),
    Make(6, "Almaz", "Piassa", Line(7, 3), Line(8, 2)),
    Make(7, "Dawit", "Bole", Line(2, 2), Line(4, 4)),
    Make(8, "Tigist", "Kazanchis", Line(1, 3), Line(6, 1)),
    Make(9, "Hana", "Bole", Line(5, 2), Line(3, 1)),
    Make(10, "Samuel", "Piassa", Line(8, 3), Line(7, 1)),
    Make(11, "Almaz", "Kazanchis", Line(2, 1), Line(4, 2), Line(6, 3)),
    Make(12, "Dawit", "Bole", Line(1, 1), Line(8, 1))
});

Console.WriteLine("\n== Bole orders, biggest first ==");
Console.WriteLine(string.Join(Environment.NewLine, book.ForArea("Bole").Select(o => $"#{o.Id,-3}{o.Customer,-8}{o.Total,8:N2} ETB")));

Console.WriteLine($"\nTotal revenue: {book.TotalRevenue():N2} ETB");
Console.WriteLine($"Busiest category: {book.BusiestCategory() ?? "(no orders yet)"}");
Console.WriteLine($"Busiest category, empty book: {new OrderBook().BusiestCategory() ?? "(no orders yet)"}");

Console.WriteLine("\n== Pages of five ==");
Console.WriteLine(string.Join(Environment.NewLine, new[] { 1, 2, 3 }.Select(p => $"Page {p}: {string.Join(", ", book.Page(p).Select(o => o.Id))}")));

Console.WriteLine("\n== Bad input is refused ==");
TryIt("quantity 0", () => new OrderLine(menu[0], 0));
TryIt("price -1", () => new MenuItem(99, "Mystery", "Food", -1m));

void TryIt(string label, Func<object> make)
{
    try
    {
        make();
        Console.WriteLine($"{label}: accepted (unexpected)");
    }
    catch (ArgumentException ex)
    {
        Console.WriteLine($"{label}: rejected - {ex.Message}");
    }
}
