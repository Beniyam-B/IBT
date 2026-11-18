public class TenPercentOff : IDiscountPolicy
{
    public decimal Apply(decimal amount) => amount * 0.90m;
}
