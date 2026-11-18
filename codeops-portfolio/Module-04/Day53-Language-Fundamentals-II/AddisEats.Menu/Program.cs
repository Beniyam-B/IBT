using System.Globalization;
using AddisEats.Menu;

// Print numbers the same way on every computer.
CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;

// The seed data from Mr. Ephrem Tesfaye.
List<MenuItem> myMenuItems = new List<MenuItem>
{
    new MenuItem(1, "Burger", "Food", 10.5m),
    new MenuItem(2, "Pizza", "Food", 15.0m),
    new MenuItem(3, "Coke", "Drink", 2.5m),
    new MenuItem(4, "Water", "Drink", 1.0m),
    new MenuItem(5, "Salad", "Food", 8.0m),
    new MenuItem(6, "Fries", "Food", 3.5m),
    new MenuItem(7, "Ice Cream", "Dessert", 4.0m)
};

Console.WriteLine("===== PART 1: LINQ tour =====");
LinqTour.Run(myMenuItems);

Console.WriteLine();
Console.WriteLine("===== PART 2: the Addis Eats menu service =====");

// Seed the service with the teacher's seven items plus an eighth.
var menu = new MenuService();
foreach (MenuItem item in myMenuItems)
{
    menu.Add(item);
}
menu.Add(new MenuItem(8, "Cake", "Dessert", 6.0m));
Console.WriteLine($"Seeded {menu.Count} items across 3 categories.");

// Add must refuse a price of zero or less.
foreach (decimal badPrice in new[] { 0m, -5m })
{
    try
    {
        menu.Add(new MenuItem(99, "Mystery", "Food", badPrice));
    }
    catch (ArgumentException ex)
    {
        Console.WriteLine($"Rejected a price of {badPrice}: {ex.Message}");
    }
}

// Every category, cheapest first, with its total and average.
foreach (string category in new[] { "Food", "Drink", "Dessert" })
{
    Console.WriteLine();
    Console.WriteLine($"{category}, cheapest first");
    foreach (MenuItem item in menu.InCategory(category))
    {
        Console.WriteLine($"  {item.Id,2}. {item.Name,-10}{item.Price,8:N2} ETB");
    }

    CategoryStats stats = menu.StatsFor(category);
    Console.WriteLine($"  {stats.Count} items, total {stats.Total:N2} ETB, average {stats.Average:N2} ETB");
}

// The trap: an empty category must not throw.
CategoryStats none = menu.StatsFor("Starters");
Console.WriteLine();
Console.WriteLine($"Starters: {none.Count} items, total {none.Total:N2} ETB, average {none.Average:N2} ETB");

// Two policies, one way to call them.
Console.WriteLine();
Console.WriteLine("Discounts");
MenuItem pizza = menu.InCategory("Food").Last();
IDiscountPolicy[] policies = { new PercentOffPolicy(), new FixedAmountOffPolicy() };
foreach (IDiscountPolicy policy in policies)
{
    Console.WriteLine($"  {policy.GetType().Name,-22} 320.00 -> {policy.Apply(320m),7:N2} ETB   {pizza.Name} {pizza.Price:N2} -> {policy.Apply(pizza.Price):N2} ETB");
}
