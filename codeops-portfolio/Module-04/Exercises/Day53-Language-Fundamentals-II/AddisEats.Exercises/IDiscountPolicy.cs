public interface IDiscountPolicy
{
    decimal Apply(decimal amount);
}
