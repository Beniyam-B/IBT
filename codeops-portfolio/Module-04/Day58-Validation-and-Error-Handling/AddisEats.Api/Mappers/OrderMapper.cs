using AddisEats.Api.Dtos;
using AddisEats.Api.Models;

namespace AddisEats.Api.Mappers;

public static class OrderMapper
{
    public static OrderDto ToDto(this Order order) =>
        new(order.Id, order.RestaurantId, order.MenuItemId, order.Quantity, order.TotalEtb,
            order.Status, order.PlacedOn, order.CustomerPhone, order.ScheduledFor);
}
