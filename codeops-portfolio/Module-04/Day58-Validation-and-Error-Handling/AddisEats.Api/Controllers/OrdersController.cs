using AddisEats.Api.Dtos;
using AddisEats.Api.Errors;
using AddisEats.Api.Mappers;
using AddisEats.Api.Models;
using AddisEats.Api.Services.OrderServices;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // OrdersController -> api/v1/orders
public class OrdersController : ApiControllerBase
{
    private readonly IOrderService _orders;

    public OrdersController(IOrderService orders)
    {
        _orders = orders;
    }

    // GET api/v1/orders/2
    [HttpGet("{id:int}")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public ActionResult<OrderDto> GetOne(int id)
    {
        var order = _orders.GetById(id);

        if (order is null)
        {
            return Fail(ErrorCatalogue.OrderNotFound, $"Order {id} does not exist.");
        }

        return order.ToDto();
    }

    // POST api/v1/orders   body: { "restaurantId": 1, "menuItemId": 1, "quantity": 2 }
    [HttpPost]
    [ProducesResponseType<OrderDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status422UnprocessableEntity)]
    public ActionResult<OrderDto> Create([FromBody] CreateOrderDto request)
    {
        var result = _orders.Place(request);

        switch (result.Outcome)
        {
            case PlaceOrderOutcome.Placed:
                // 201 Created, with a Location header that points at GET api/v1/orders/{id}
                return CreatedAtAction(nameof(GetOne), new { id = result.Order!.Id }, result.Order.ToDto());

            case PlaceOrderOutcome.AmountInvalid:
                return Fail(ErrorCatalogue.AmountInvalid, "Quantity must be greater than zero.");

            case PlaceOrderOutcome.RestaurantNotFound:
                return Fail(ErrorCatalogue.RestaurantNotFound, $"Restaurant {request.RestaurantId} does not exist.");

            case PlaceOrderOutcome.RestaurantClosed:
                return Fail(ErrorCatalogue.RestaurantClosed, $"Restaurant {request.RestaurantId} is closed.");

            case PlaceOrderOutcome.MenuItemNotFound:
                return Fail(ErrorCatalogue.MenuItemNotFound, $"Menu item {request.MenuItemId} does not exist.");

            case PlaceOrderOutcome.ItemNotOnMenu:
                return Fail(ErrorCatalogue.ItemNotOnMenu, $"Menu item {request.MenuItemId} is not on restaurant {request.RestaurantId}'s menu.");

            default:
                return Fail(ErrorCatalogue.InternalError, "The order could not be placed.");
        }
    }

    // PATCH api/v1/orders/2/status   body: { "status": "OnTheWay" }   (forward moves only)
    [HttpPatch("{id:int}/status")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public ActionResult<OrderDto> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto request)
    {
        if (!Enum.IsDefined(request.Status))
        {
            var errors = new Dictionary<string, string[]> { ["status"] = new[] { "Unknown status." } };
            return Fail(ErrorCatalogue.ValidationFailed, "One or more fields are missing or malformed.", errors);
        }

        var order = _orders.GetById(id);

        if (order is null)
        {
            return Fail(ErrorCatalogue.OrderNotFound, $"Order {id} does not exist.");
        }

        // 409: the request is well formed but clashes with the order's current state.
        if (!_orders.TryChangeStatus(order, request.Status))
        {
            var hint = request.Status == OrderStatus.Cancelled ? " Use DELETE to cancel an order." : "";
            return Fail(ErrorCatalogue.OrderStatusConflict, $"An order that is {order.Status} cannot move to {request.Status}.{hint}");
        }

        return order.ToDto();
    }

    // DELETE api/v1/orders/2   (cancels the order)
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public IActionResult Cancel(int id)
    {
        switch (_orders.Cancel(id))
        {
            case CancelOutcome.Cancelled:
                return NoContent();   // 204: it worked and there is nothing to say

            case CancelOutcome.NotFound:
                return Fail(ErrorCatalogue.OrderNotFound, $"Order {id} does not exist.");

            case CancelOutcome.AlreadyDelivered:
                return Fail(ErrorCatalogue.OrderAlreadyDelivered, "A delivered order cannot be cancelled.");

            default:
                return Fail(ErrorCatalogue.OrderStatusConflict, "An order that is on its way cannot be cancelled.");
        }
    }
}
