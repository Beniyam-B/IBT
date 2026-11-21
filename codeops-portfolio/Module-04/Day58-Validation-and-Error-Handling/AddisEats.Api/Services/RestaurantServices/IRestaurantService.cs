using AddisEats.Api.Models;
using AddisEats.Api.Queries;

namespace AddisEats.Api.Services.RestaurantServices;

public interface IRestaurantService
{
    IReadOnlyList<Restaurant> GetAll(RestaurantQuery q);

    Restaurant? GetById(int id);

    int CountAll(RestaurantQuery q);
}
