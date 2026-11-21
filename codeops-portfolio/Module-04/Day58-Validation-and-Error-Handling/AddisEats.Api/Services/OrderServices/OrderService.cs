using AddisEats.Api.Data;
using AddisEats.Api.Dtos;
using AddisEats.Api.Models;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.RestaurantServices;

namespace AddisEats.Api.Services.OrderServices;

public class OrderService : IOrderService
{
    private static readonly object Gate = new();

    // PATCH moves an order forward only. Cancelling is DELETE, so there is exactly one way to cancel.
    private static readonly Dictionary<OrderStatus, OrderStatus[]> Allowed = new()
    {
        [OrderStatus.Placed] = new[] { OrderStatus.Preparing },
        [OrderStatus.Preparing] = new[] { OrderStatus.OnTheWay },
        [OrderStatus.OnTheWay] = new[] { OrderStatus.Delivered },
        [OrderStatus.Delivered] = Array.Empty<OrderStatus>(),
        [OrderStatus.Cancelled] = Array.Empty<OrderStatus>()
    };

    // The shared seed list, so orders survive from one request to the next.
    private readonly List<Order> _orders = SeedData.Orders;
    private readonly IRestaurantService _restaurants;
    private readonly IMenuService _menu;

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

    public PlaceOrderResult Place(CreateOrderDto request)
    {
        if (request.Quantity <= 0)
        {
            return new PlaceOrderResult(PlaceOrderOutcome.AmountInvalid);
        }

        var restaurant = _restaurants.GetById(request.RestaurantId);

        if (restaurant is null)
        {
            return new PlaceOrderResult(PlaceOrderOutcome.RestaurantNotFound);
        }

        if (!restaurant.IsActive)
        {
            return new PlaceOrderResult(PlaceOrderOutcome.RestaurantClosed);
        }

        var item = _menu.GetById(request.MenuItemId);

        if (item is null)
        {
            return new PlaceOrderResult(PlaceOrderOutcome.MenuItemNotFound);
        }

        if (item.RestaurantId != restaurant.Id)
        {
            return new PlaceOrderResult(PlaceOrderOutcome.ItemNotOnMenu);
        }

        lock (Gate)
        {
            var order = new Order
            {
                Id = _orders.Count == 0 ? 1 : _orders.Max(o => o.Id) + 1,
                RestaurantId = restaurant.Id,
                MenuItemId = item.Id,
                Quantity = request.Quantity,
                CustomerPhone = request.Phone,
                ScheduledFor = request.IsScheduled ? request.ScheduledFor : null,
                TotalEtb = item.PriceEtb * request.Quantity + restaurant.DeliveryFeeEtb,
                Status = OrderStatus.Placed,
                PlacedOn = DateTime.UtcNow
            };

            _orders.Add(order);
            return new PlaceOrderResult(PlaceOrderOutcome.Placed, order);
        }
    }

    public bool TryChangeStatus(Order order, OrderStatus next)
    {
        lock (Gate)
        {
            if (!Allowed[order.Status].Contains(next))
            {
                return false;
            }

            order.Status = next;
            return true;
        }
    }

    public CancelOutcome Cancel(int id)
    {
        lock (Gate)
        {
            var order = _orders.FirstOrDefault(o => o.Id == id);

            if (order is null)
            {
                return CancelOutcome.NotFound;
            }

            if (order.Status == OrderStatus.Cancelled)
            {
                return CancelOutcome.Cancelled;   // idempotent: cancelling twice is not an error
            }

            if (order.Status == OrderStatus.Delivered)
            {
                return CancelOutcome.AlreadyDelivered;
            }

            if (order.Status == OrderStatus.OnTheWay)
            {
                return CancelOutcome.NotCancellable;
            }

            order.Status = OrderStatus.Cancelled;
            return CancelOutcome.Cancelled;
        }
    }
}

