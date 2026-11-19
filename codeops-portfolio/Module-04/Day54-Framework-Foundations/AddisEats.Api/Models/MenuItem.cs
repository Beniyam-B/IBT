namespace AddisEats.Api.Models;

public class MenuItem
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public decimal PriceEtb { get; set; }
}
