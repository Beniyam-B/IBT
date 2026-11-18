namespace AddisEats.Ordering;

// A record: data only. The price is checked at the door, so a bad price can never exist.
public record MenuItem
{
    public int Id { get; }
    public string Name { get; }
    public string Category { get; }
    public decimal Price { get; }

    public MenuItem(int id, string name, string category, decimal price)
    {
        if (price <= 0m)
        {
            throw new ArgumentException("Price must be greater than zero.", nameof(price));
        }

        Id = id;
        Name = name;
        Category = category;
        Price = price;
    }
}
