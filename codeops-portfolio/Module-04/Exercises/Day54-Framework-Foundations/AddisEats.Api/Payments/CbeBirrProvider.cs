namespace AddisEats.Api.Payments;

public class CbeBirrProvider : IPaymentProvider
{
    public string Name => "CBE Birr";

    public bool Charge(string phone, decimal amountEtb)
    {
        if (amountEtb <= 0m)
        {
            throw new ArgumentException("Amount must be positive.", nameof(amountEtb));
        }

        return true;   // pretend the charge worked
    }
}
