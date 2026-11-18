public static class Ex03Properties
{
    public static void Run()
    {
        var r = new Restaurant { Id = 14, Name = "Yod Abyssinia", Area = "Bole" };
        Console.WriteLine(r.DisplayName);

        r.Name = "Yod Abyssinia Bole";               // settable: allowed
        Console.WriteLine(r.DisplayName);            // computed: changed on its own

        // r.Id = 99;   // does not compile: error CS8852, init-only property can only be assigned in an object initializer
        Console.WriteLine($"Id is still {r.Id}");
    }
}
