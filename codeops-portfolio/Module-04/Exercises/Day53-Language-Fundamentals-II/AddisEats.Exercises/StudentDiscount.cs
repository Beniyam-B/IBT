public class StudentDiscount : IDiscountPolicy
{
    public decimal Apply(decimal amount) => amount * 0.80m;
}
