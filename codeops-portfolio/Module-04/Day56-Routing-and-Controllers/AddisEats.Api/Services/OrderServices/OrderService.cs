using AddisEats.Api.Data;
using AddisEats.Api.Dtos;
using AddisEats.Api.Models;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.RestaurantServices;

namespace AddisEats.Api.Services.OrderServices;

public class OrderService : IOrderService
{
    private static readonly object Gate = new();

    // The shared seed list, so orders survive from one request to the next.
    private readonly List<Order> _orders = SeedData.Orders;
    private readonly IRestaurantService _restaurants;
    private readonly IMenuService _menu;

    // A service can depend on other services: the container supplies them too.
    public OrderService(IRestaurantService restaurants, IMenuService menu)
    {
        _restaurants = restaurants;
        _menu = menu;
    }

    public Order? GetById(int id)
    {
        lock (Gate)
        {
            return _orders.FirstOrDefault(o => o.Id == id);
        }
    }

    public Order? Place(CreateOrderDto request)
    {
        var restaurant = _restaurants.GetById(request.RestaurantId);
        var item = _menu.GetById(request.MenuItemId);

        if (restaurant is null || !restaurant.IsActive
            || item is null || item.RestaurantId != restaurant.Id
            || request.Quantity <= 0)
        {
            return null;
        }

        lock (Gate)
        {
            var order = new Order
            {
                Id = _orders.Count == 0 ? 1 : _orders.Max(o => o.Id) + 1,
                RestaurantId = restaurant.Id,
                MenuItemId = item.Id,
                Quantity = request.Quantity,
                TotalEtb = item.PriceEtb * request.Quantity + restaurant.DeliveryFeeEtb,
                Status = OrderStatus.Placed,
                PlacedOn = DateTime.UtcNow
            };

            _orders.Add(order);
            return order;
        }
    }
}
