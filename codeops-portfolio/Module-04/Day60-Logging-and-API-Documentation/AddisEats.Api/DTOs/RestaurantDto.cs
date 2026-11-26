namespace AddisEats.Api.DTOs;

// What HTTP sees. OwnerAddress is deliberately absent.
public record RestaurantDto(int Id, string Name, string Address, string Phone, bool IsActive, decimal DeliveryFeeEtb);

