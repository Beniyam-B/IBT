namespace AddisEats.Api.Dtos;

// What the API accepts when a client creates a menu item (the JSON body of a POST).
public record CreateMenuItemRequest(string Name, string Category, decimal PriceEtb);
