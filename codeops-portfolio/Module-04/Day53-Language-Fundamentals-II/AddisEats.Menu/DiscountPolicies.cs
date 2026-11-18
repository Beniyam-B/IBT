namespace AddisEats.Menu;

// The contract: anything that can turn a price into a discounted price.
public interface IDiscountPolicy
{
    decimal Apply(decimal price);
}

// Ten percent off.
public class PercentOffPolicy : IDiscountPolicy
{
    private const decimal Rate = 0.10m;

    public decimal Apply(decimal price) =>
        decimal.Round(price - (price * Rate), 2, MidpointRounding.AwayFromZero);
}

// A flat 50 ETB off, but never below zero.
public class FixedAmountOffPolicy : IDiscountPolicy
{
    private const decimal AmountOff = 50m;

    public decimal Apply(decimal price) => Math.Max(0m, price - AmountOff);
}
