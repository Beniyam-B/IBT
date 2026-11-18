using AddisEats.Api.Data;
using AddisEats.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AddisEats.Api.Services;

// The same IMenuService, but the data lives in a real database table.
public class DbMenuService : IMenuService
{
    private readonly AddisEatsContext _db;

    public DbMenuService(AddisEatsContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<MenuItem>> SearchAsync(string? category, decimal maxPriceEtb, int page, int pageSize)
    {
        var query = _db.MenuItems
            .AsNoTracking()
            .Where(m => m.PriceEtb <= maxPriceEtb);

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(m => m.Category == category);
        }

        return await query
            .OrderBy(m => m.PriceEtb)
            .ThenBy(m => m.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public Task<MenuItem?> GetByIdAsync(int id) =>
        _db.MenuItems.AsNoTracking().FirstOrDefaultAsync(m => m.Id == id);

    public async Task<MenuItem> AddAsync(MenuItem item)
    {
        _db.MenuItems.Add(item);
        await _db.SaveChangesAsync();
        return item;
    }
}
