using AddisEats.Api.Dtos;
using AddisEats.Api.Models;

namespace AddisEats.Api.Mappers;

public static class RestaurantMapper
{
    public static RestaurantDto ToDto(this Restaurant restaurant) =>
        new(restaurant.Id, restaurant.Name, restaurant.Address, restaurant.Phone, restaurant.IsActive, restaurant.DeliveryFeeEtb);
}
