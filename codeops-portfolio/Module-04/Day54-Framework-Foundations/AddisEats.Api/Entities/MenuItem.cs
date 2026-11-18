namespace AddisEats.Api.Entities;

// The menu item as the application (and later the database) stores it.
public class MenuItem
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal PriceEtb { get; set; }
}
