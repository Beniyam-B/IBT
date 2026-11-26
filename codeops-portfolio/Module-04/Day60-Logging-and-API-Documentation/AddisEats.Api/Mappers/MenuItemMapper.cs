using AddisEats.Api.DTOs;
using AddisEats.Api.Models;

namespace AddisEats.Api.Mappers;

public static class MenuItemMapper
{
    public static MenuItemDto ToDto(this MenuItem item) =>
        new(item.Id, item.RestaurantId, item.Name, item.Category, item.PriceEtb);
}

