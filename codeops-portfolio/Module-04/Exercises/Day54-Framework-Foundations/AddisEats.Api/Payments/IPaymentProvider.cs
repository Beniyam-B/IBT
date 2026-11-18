namespace AddisEats.Api.Payments;

public interface IPaymentProvider
{
    string Name { get; }
    bool Charge(string phone, decimal amountEtb);
}
