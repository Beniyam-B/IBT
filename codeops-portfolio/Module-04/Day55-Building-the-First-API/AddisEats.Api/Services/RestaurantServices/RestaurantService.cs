using AddisEats.Api.Data;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services.RestaurantServices;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> _all = SeedData.Restaurants;

    public IReadOnlyList<Restaurant> GetAll(string? area, int page, int limit) =>
        _all
            .Where(r => MatchesArea(r, area))
            .OrderBy(r => r.Name)              // ALWAYS order first, or page 2 can repeat page 1
            .ThenBy(r => r.Id)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();

    public Restaurant? GetById(int id) => _all.FirstOrDefault(r => r.Id == id);

    public int CountAll(string? area) => _all.Count(r => MatchesArea(r, area));

    // A missing area means "all".
    private static bool MatchesArea(Restaurant r, string? area) =>
        string.IsNullOrWhiteSpace(area) || r.Address.Equals(area, StringComparison.OrdinalIgnoreCase);
}
