public static class Ex06Interfaces
{
    // Depends on the interface, so it works with any policy, now or later.
    public static decimal PriceAfter(decimal amount, IDiscountPolicy policy) => policy.Apply(amount);

    public static void Run()
    {
        decimal price = 480m;
        Console.WriteLine($"10% off:  {PriceAfter(price, new TenPercentOff()):N2}");
        Console.WriteLine($"50 off:   {PriceAfter(price, new FiftyEtbOff()):N2}");
        Console.WriteLine($"Student:  {PriceAfter(price, new StudentDiscount()):N2}");   // added later, PriceAfter not touched
    }
}
