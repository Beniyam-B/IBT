public static class Ex01Methods
{
    // Switch expression picks the rate. A VIP always pays 0.
    public static decimal DeliveryFee(string area, bool isVip = false)
    {
        if (isVip) return 0m;

        return area switch
        {
            "Bole" => 50m,
            "Piassa" => 65m,
            "Kazanchis" => 60m,
            _ => 80m
        };
    }

    public static void Run()
    {
        Console.WriteLine($"Positional: {DeliveryFee("Bole", false):N2} ETB");
        Console.WriteLine($"Named:      {DeliveryFee("Piassa", isVip: true):N2} ETB");
        Console.WriteLine($"Default:    {DeliveryFee("Kazanchis"):N2} ETB");
    }
}
