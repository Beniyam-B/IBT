public static class Ex07Exceptions
{
    public static void Charge(decimal amountEtb)
    {
        if (amountEtb <= 0m)
            throw new ArgumentException("Amount must be positive.", nameof(amountEtb));

        Console.WriteLine($"Charged {amountEtb:N2} ETB");
    }

    public static void Run()
    {
        foreach (decimal amount in new[] { 250m, -5m })
        {
            try
            {
                Charge(amount);
            }
            catch (ArgumentException ex)
            {
                Console.WriteLine($"Caught: {ex.Message}");
            }
            finally
            {
                Console.WriteLine("finally ran");
            }
        }
    }
}
