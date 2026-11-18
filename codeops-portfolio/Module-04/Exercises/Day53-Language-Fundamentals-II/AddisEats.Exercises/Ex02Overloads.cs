public static class Ex02Overloads
{
    public static void Describe(int value) => Console.WriteLine($"int overload chosen: {value}");
    public static void Describe(string value) => Console.WriteLine($"string overload chosen: {value}");
    public static void Describe(decimal value) => Console.WriteLine($"decimal overload chosen: {value:N2}");

    // A fourth overload that differs ONLY by return type. Uncomment it, build once to see the error, then comment it out again:
    // public static string Describe(int value) => "x";
    // error CS0111: Type 'Ex02Overloads' already defines a member called 'Describe' with the same parameter types

    public static void Run()
    {
        Describe(7);
        Describe("Doro Wat");
        Describe(320.5m);
    }
}
