using AddisEats.Api.Common;
using AddisEats.Api.Configuration;
using AddisEats.Api.Data;
using AddisEats.Api.DTOs;
using AddisEats.Api.Models;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.RestaurantServices;
using Microsoft.Extensions.Options;

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
    private readonly OrderOptions _options;
    private readonly ILogger<OrderService> _log;

    public OrderService(IRestaurantService restaurants, IMenuService menu, IOptions<OrderOptions> options, ILogger<OrderService> log)
    {
        _restaurants = restaurants;
        _menu = menu;
        _options = options.Value;
        _log = log;
    }

    public Result<Order> GetById(int id)
    {
        lock (Gate)
        {
            var order = _orders.FirstOrDefault(o => o.Id == id);

            return order is null
                ? Fail(ErrorCatalogue.OrderNotFound, $"Order {id} does not exist.")
                : Result<Order>.Ok(order);
        }
    }

    public Result<Order> Place(CreateOrderDto request)
    {
        var restaurant = _restaurants.GetById(request.RestaurantId);

        if (restaurant is null)
        {
            return Fail(ErrorCatalogue.RestaurantNotFound, $"Restaurant {request.RestaurantId} does not exist.");
        }

        if (!restaurant.IsActive)
        {
            return Fail(ErrorCatalogue.RestaurantClosed, $"Restaurant {restaurant.Id} is closed.");
        }

        var item = _menu.GetById(request.MenuItemId);

        if (item is null)
        {
            return Fail(ErrorCatalogue.MenuItemNotFound, $"Menu item {request.MenuItemId} does not exist.");
        }

        if (item.RestaurantId != restaurant.Id)
        {
            return Fail(ErrorCatalogue.ItemNotOnMenu, $"Menu item {item.Id} is not on restaurant {restaurant.Id}'s menu.");
        }

        _log.LogDebug("Delivery fee for {Area} is {DeliveryFeeEtb} ETB", restaurant.Address, restaurant.DeliveryFeeEtb);

        // Money is worked out here from the menu prices. It is never taken from the client.
        decimal total = item.PriceEtb * request.Quantity + restaurant.DeliveryFeeEtb;

        if (total < _options.MinimumOrderEtb)
        {
            return Fail(ErrorCatalogue.AmountInvalid,
                $"The order total must be at least {_options.MinimumOrderEtb:N2} ETB (this one is {total:N2} ETB).");
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
                TotalEtb = total,
                Status = OrderStatus.Placed,
                PlacedOn = DateTime.UtcNow
            };

            _orders.Add(order);

            // A business event worth counting later. The area and ids, never the customer's phone or address.
            _log.LogInformation("Order {OrderId} placed at restaurant {RestaurantId} in {Area}: {Quantity} x item {MenuItemId}, total {TotalEtb} ETB",
                order.Id, restaurant.Id, restaurant.Address, order.Quantity, item.Id, order.TotalEtb);

            return Result<Order>.Ok(order);
        }
    }

    public Result<Order> ChangeStatus(int id, OrderStatus next)
    {
        lock (Gate)
        {
            var order = _orders.FirstOrDefault(o => o.Id == id);

            if (order is null)
            {
                return Fail(ErrorCatalogue.OrderNotFound, $"Order {id} does not exist.");
            }

            if (!Allowed[order.Status].Contains(next))
            {
                var hint = next == OrderStatus.Cancelled ? " Use DELETE to cancel an order." : "";
                return Fail(ErrorCatalogue.OrderStatusConflict, $"An order that is {order.Status} cannot move to {next}.{hint}");
            }

            var previous = order.Status;
            order.Status = next;

            _log.LogInformation("Order {OrderId} moved from {PreviousStatus} to {Status}", order.Id, previous, next);

            return Result<Order>.Ok(order);
        }
    }

    public Result<Order> Cancel(int id)
    {
        lock (Gate)
        {
            var order = _orders.FirstOrDefault(o => o.Id == id);

            if (order is null)
            {
                return Fail(ErrorCatalogue.OrderNotFound, $"Order {id} does not exist.");
            }

            if (order.Status == OrderStatus.Cancelled)
            {
                return Result<Order>.Ok(order);   // idempotent: cancelling twice is not an error
            }

            if (order.Status == OrderStatus.Delivered)
            {
                return Fail(ErrorCatalogue.OrderAlreadyDelivered, "A delivered order cannot be cancelled.");
            }

            if (order.Status == OrderStatus.OnTheWay)
            {
                return Fail(ErrorCatalogue.OrderStatusConflict, "An order that is on its way cannot be cancelled.");
            }

            var previous = order.Status;
            order.Status = OrderStatus.Cancelled;

            _log.LogInformation("Order {OrderId} cancelled (it was {PreviousStatus})", order.Id, previous);

            return Result<Order>.Ok(order);
        }
    }

    // A rejection is normal traffic, not a failure of ours, so it is Information. Only the catalogue code is logged.
    private Result<Order> Fail(ApiError error, string detail)
    {
        _log.LogInformation("Order request rejected: {Code}", error.Code);
        return Result<Order>.Fail(error, detail);
    }
}
