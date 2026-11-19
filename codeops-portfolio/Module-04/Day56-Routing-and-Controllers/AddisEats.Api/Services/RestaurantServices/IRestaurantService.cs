using AddisEats.Api.Models;

namespace AddisEats.Api.Services.RestaurantServices;

public interface IRestaurantService
{
    // IReadOnlyList says "do not edit": the caller gets results, not the store itself.
    IReadOnlyList<Restaurant> GetAll(string? area, int page, int limit);

    Restaurant? GetById(int id);

    int CountAll(string? area);
}
