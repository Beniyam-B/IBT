using AddisEats.Api.Data;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services.MenuServices;

public class MenuService : IMenuService
{
    private static readonly object Gate = new();

    // This is the shared SeedData list, not a copy. The service is scoped, so a new MenuService is built for every request.
    // If each one copied the list, an item added by a POST would disappear before the next request.
    private readonly List<MenuItem> _items = SeedData.MenuItems;

    public List<MenuItem> GetAll(string? category, decimal maxPrice, int page, int pageSize)
    {
        lock (Gate)
        {
            return _items
                .Where(m => string.IsNullOrWhiteSpace(category)
                            || m.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                .Where(m => m.PriceEtb <= maxPrice)
                .OrderBy(m => m.PriceEtb)          // always order before paging
                .ThenBy(m => m.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }
    }

    public int CountAll(string? category, decimal maxPrice)
    {
        lock (Gate)
        {
            return _items.Count(m => (string.IsNullOrWhiteSpace(category)
                                      || m.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                                     && m.PriceEtb <= maxPrice);
        }
    }

    public MenuItem? GetById(int id)
    {
        lock (Gate)
        {
            return _items.FirstOrDefault(m => m.Id == id);
        }
    }

    public MenuItem Add(MenuItem item)
    {
        lock (Gate)
        {
            item.Id = _items.Count == 0 ? 1 : _items.Max(m => m.Id) + 1;
            _items.Add(item);
            return item;
        }
    }

    public List<MenuItem> ForRestaurant(int restaurantId, string? category)
    {
        lock (Gate)
        {
            return _items
                .Where(m => m.RestaurantId == restaurantId)
                .Where(m => string.IsNullOrWhiteSpace(category)
                            || m.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                .OrderBy(m => m.Id)
                .ToList();
        }
    }
}


