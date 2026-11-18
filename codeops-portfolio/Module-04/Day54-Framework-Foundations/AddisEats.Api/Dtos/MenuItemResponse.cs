namespace AddisEats.Api.Dtos;

// What the API sends out. A record: data only, nothing can change it after it is built.
public record MenuItemResponse(int Id, string Name, string Category, decimal PriceEtb);
