public static class Ex05Linq
{
    public static void Run()
    {
        string[] customerNames = { "Almaz", "Dawit", "Tigist", "Hana", "Samuel" };
        string[] areaNames = { "Bole", "Piassa", "Kazanchis" };

        List<Order> orders = Enumerable.Range(1, 25)
            .Select(i => new Order(i, customerNames[i % 5], areaNames[i % 3], 100m + i * 37m, new DateTime(2026, 11, 1).AddHours(i)))
            .ToList();

        var boleOver500 = orders.Where(o => o.Area == "Bole" && o.Total > 500m).ToList();

        var allNames = orders.Select(o => o.CustomerName).Distinct().OrderBy(n => n).ToList();

        decimal kazanchisRevenue = orders.Where(o => o.Area == "Kazanchis").Sum(o => o.Total);

        var page3 = orders.OrderByDescending(o => o.PlacedOn).Skip(20).Take(10).ToList();

        Console.WriteLine($"Bole orders over 500 ETB: {boleOver500.Count}");
        Console.WriteLine($"Customers A-Z: {string.Join(", ", allNames)}");
        Console.WriteLine($"Kazanchis revenue: {kazanchisRevenue:N2} ETB");
        Console.WriteLine($"Page 3 order ids: {string.Join(", ", page3.Select(o => o.Id))}");
    }
}
