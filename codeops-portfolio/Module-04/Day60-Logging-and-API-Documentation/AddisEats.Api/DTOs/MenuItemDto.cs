namespace AddisEats.Api.DTOs;

// What HTTP sees for a menu item.
public record MenuItemDto(int Id, int RestaurantId, string Name, string Category, decimal PriceEtb);

