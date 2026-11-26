using AddisEats.Api.Data;
using AddisEats.Api.Models;
using AddisEats.Api.DTOs;

namespace AddisEats.Api.Services.RestaurantServices;

public class RestaurantService : IRestaurantService
{
    private readonly List<Restaurant> _all = SeedData.Restaurants;

    // The service decides what the query means. It takes the query object, not the HttpContext.
    public IReadOnlyList<Restaurant> GetAll(RestaurantQuery q) =>
        Filter(q)
            .OrderBy(r => r.Name)              // ALWAYS order first, or page 2 can repeat page 1
            .ThenBy(r => r.Id)
            .Skip((q.Page - 1) * q.Limit)
            .Take(q.Limit)
            .ToList();

    public Restaurant? GetById(int id) => _all.FirstOrDefault(r => r.Id == id);

    public int CountAll(RestaurantQuery q) => Filter(q).Count();

    private IEnumerable<Restaurant> Filter(RestaurantQuery q) =>
        _all
            .Where(r => MatchesArea(r, q.Area))
            .Where(r => q.Areas.Count == 0 || q.Areas.Contains(r.Address, StringComparer.OrdinalIgnoreCase))
            .Where(r => q.MaxFeeEtb == null || r.DeliveryFeeEtb <= q.MaxFeeEtb);

    // A missing area means "all".
    private static bool MatchesArea(Restaurant r, string? area) =>
        string.IsNullOrWhiteSpace(area) || r.Address.Equals(area, StringComparison.OrdinalIgnoreCase);
}


