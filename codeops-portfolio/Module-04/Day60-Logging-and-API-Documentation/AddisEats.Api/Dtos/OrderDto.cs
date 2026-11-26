using AddisEats.Api.Models;

namespace AddisEats.Api.Dtos;

public record OrderDto(
    int Id, int RestaurantId, int MenuItemId, int Quantity, decimal TotalEtb,
    OrderStatus Status, DateTime PlacedOn, string CustomerPhone, DateTime? ScheduledFor);
