using AddisEats.Api.Data;
using AddisEats.Api.Entities;

namespace AddisEats.Api.Services;

// The Day 53 service, moved behind IMenuService. The data is an in-memory list.
public class MenuService : IMenuService
{
    // static: ONE list shared by every request, so a POST is still there on the next request.
    // Shared state needs a lock (Day 54, section 3). The database version in Part B removes this.
    private static readonly List<MenuItem> Items = MenuSeed.Items
        .Select(i => new MenuItem { Id = i.Id, Name = i.Name, Category = i.Category, PriceEtb = i.PriceEtb })
        .ToList();
    private static readonly object Gate = new();
    private static int _nextId = Items.Max(i => i.Id) + 1;

    public Task<IReadOnlyList<MenuItem>> SearchAsync(string? category, decimal maxPriceEtb, int page, int pageSize)
    {
        lock (Gate)
        {
            IReadOnlyList<MenuItem> result = Items
                .Where(i => i.PriceEtb <= maxPriceEtb)
                .Where(i => string.IsNullOrWhiteSpace(category)
                            || i.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                .OrderBy(i => i.PriceEtb)
                .ThenBy(i => i.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Task.FromResult(result);
        }
    }

    public Task<MenuItem?> GetByIdAsync(int id)
    {
        lock (Gate)
        {
            return Task.FromResult(Items.FirstOrDefault(i => i.Id == id));
        }
    }

    public Task<MenuItem> AddAsync(MenuItem item)
    {
        lock (Gate)
        {
            item.Id = _nextId++;
            Items.Add(item);
            return Task.FromResult(item);
        }
    }
}
