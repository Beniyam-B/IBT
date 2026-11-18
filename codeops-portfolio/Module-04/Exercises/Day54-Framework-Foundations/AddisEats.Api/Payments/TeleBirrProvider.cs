namespace AddisEats.Api.Payments;

public class TeleBirrProvider : IPaymentProvider
{
    public string Name => "TeleBirr";

    public bool Charge(string phone, decimal amountEtb)
    {
        if (amountEtb <= 0m)
        {
            throw new ArgumentException("Amount must be positive.", nameof(amountEtb));
        }

        return true;   // pretend the charge worked
    }
}
