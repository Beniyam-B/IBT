namespace AddisEats.Api.Dtos;

// The body a client sends to place an order. The server works out the total and the status.
public record CreateOrderDto(int RestaurantId, int MenuItemId, int Quantity);
