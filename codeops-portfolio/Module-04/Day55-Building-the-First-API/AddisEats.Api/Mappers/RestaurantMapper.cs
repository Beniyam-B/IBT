using AddisEats.Api.Dtos;
using AddisEats.Api.Models;

namespace AddisEats.Api.Mappers;

public static class RestaurantMapper
{
    // An extension method: restaurant.ToDto()
    public static RestaurantDto ToDto(this Restaurant restaurant) =>
        new(restaurant.Id, restaurant.Name, restaurant.Address, restaurant.Phone, restaurant.IsActive);
}
