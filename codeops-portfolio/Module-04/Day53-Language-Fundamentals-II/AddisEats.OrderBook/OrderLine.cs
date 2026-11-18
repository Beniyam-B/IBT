namespace AddisEats.Ordering;

// One menu item and how many of it were ordered.
public record OrderLine
{
    public MenuItem Item { get; }
    public int Quantity { get; }

    public OrderLine(MenuItem item, int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));
        }

        Item = item;
        Quantity = quantity;
    }

    public decimal LineTotal => Item.Price * Quantity;
}
