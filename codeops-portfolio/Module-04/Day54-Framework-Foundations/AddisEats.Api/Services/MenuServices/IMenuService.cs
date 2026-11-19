using AddisEats.Api.Models;

namespace AddisEats.Api.Services.MenuServices;

public interface IMenuService
{
    List<MenuItem> GetAll(string? category, decimal maxPrice, int page, int pageSize);
    MenuItem? GetById(int id);
    MenuItem Add(MenuItem item);
}
