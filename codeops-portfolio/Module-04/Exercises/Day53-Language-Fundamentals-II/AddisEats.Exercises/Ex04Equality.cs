public static class Ex04Equality
{
    public static void Run()
    {
        var a = new Customer("Almaz Bekele", "0911000000");
        var b = new Customer("Almaz Bekele", "0911000000");
        Console.WriteLine($"Record equal: {a == b}");

        var c = new CustomerClass("Almaz Bekele", "0911000000");
        var d = new CustomerClass("Almaz Bekele", "0911000000");
        Console.WriteLine($"Class equal:  {c == d}");

        // A record compares by value (same data = equal); a class compares by reference (two separate objects are never equal).
    }
}
