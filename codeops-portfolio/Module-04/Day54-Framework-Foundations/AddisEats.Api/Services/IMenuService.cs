using AddisEats.Api.Entities;

namespace AddisEats.Api.Services;

// What the controller needs from "a menu", without knowing where the data lives.
public interface IMenuService
{
    Task<IReadOnlyList<MenuItem>> SearchAsync(string? category, decimal maxPriceEtb, int page, int pageSize);
    Task<MenuItem?> GetByIdAsync(int id);
    Task<MenuItem> AddAsync(MenuItem item);
}
