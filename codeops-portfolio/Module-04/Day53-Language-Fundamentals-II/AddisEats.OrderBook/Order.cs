namespace AddisEats.Ordering;

public class Order
{
    public int Id { get; }
    public string Customer { get; }
    public string Area { get; }
    public DateTime PlacedOn { get; }
    public IReadOnlyList<OrderLine> Lines { get; }

    // Computed on every read, so it can never go out of date.
    public decimal Total => Lines.Sum(l => l.LineTotal);

    public Order(int id, string customer, string area, DateTime placedOn, IEnumerable<OrderLine> lines)
    {
        Id = id;
        Customer = customer;
        Area = area;
        PlacedOn = placedOn;
        Lines = lines.ToList();
    }
}
