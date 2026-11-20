namespace AddisEats.Api.Dtos;

// The body a client sends to create a menu item. It has no Id: the server chooses it.
public record CreateMenuItemDto(string Name, string Category, decimal PriceEtb);
