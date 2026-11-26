namespace AddisEats.Api.Models;

public class Order
{
    public int Id { get; init; }
    public int RestaurantId { get; set; }
    public int MenuItemId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalEtb { get; set; }
    public string CustomerPhone { get; set; } = "";
    public DateTime? ScheduledFor { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Placed;
    public DateTime PlacedOn { get; set; }
}

