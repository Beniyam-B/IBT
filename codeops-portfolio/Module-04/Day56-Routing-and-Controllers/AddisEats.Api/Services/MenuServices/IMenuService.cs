using AddisEats.Api.Models;

namespace AddisEats.Api.Services.MenuServices;

public interface IMenuService
{
    List<MenuItem> GetAll(string? category, decimal maxPrice, int page, int pageSize);
    MenuItem? GetById(int id);
    MenuItem Add(MenuItem item);
    int CountAll(string? category, decimal maxPrice);

    // The menu of one restaurant, optionally narrowed to one category. An empty list is a valid answer.
    List<MenuItem> ForRestaurant(int restaurantId, string? category);
}

