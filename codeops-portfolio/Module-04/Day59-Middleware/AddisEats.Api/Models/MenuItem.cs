namespace AddisEats.Api.Models;

public class MenuItem
{
    public int Id { get; set; }
    public int RestaurantId { get; set; }          // which restaurant sells it (0 = not attached yet)
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal PriceEtb { get; set; }
}
