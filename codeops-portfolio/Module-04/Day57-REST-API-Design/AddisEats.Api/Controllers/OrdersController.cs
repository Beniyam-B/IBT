using AddisEats.Api.Dtos;
using AddisEats.Api.Mappers;
using AddisEats.Api.Services.OrderServices;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // OrdersController -> api/v1/orders
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;

    public OrdersController(IOrderService orders)
    {
        _orders = orders;
    }

    // GET api/v1/orders/2
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<OrderDto> GetOne(int id)
    {
        var order = _orders.GetById(id);

        if (order is null)
        {
            return NotFound(new { message = $"Order {id} does not exist." });
        }

        return order.ToDto();
    }

    // POST api/v1/orders   body: { "restaurantId": 1, "menuItemId": 1, "quantity": 2 }
    [HttpPost]
    [ProducesResponseType<OrderDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<OrderDto> Create([FromBody] CreateOrderDto request)
    {
        if (request.Quantity <= 0)
        {
            return BadRequest(new { message = "Quantity must be greater than zero." });
        }

        var order = _orders.Place(request);

        if (order is null)
        {
            return BadRequest(new { message = "The restaurant does not exist or is closed, or the item is not on that restaurant's menu." });
        }

        // 201 Created, with a Location header that points at GET api/v1/orders/{id}
        return CreatedAtAction(nameof(GetOne), new { id = order.Id }, order.ToDto());
    }

    // PATCH api/v1/orders/2/status   body: { "status": "OnTheWay" }
    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public ActionResult<OrderDto> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto request)
    {
        if (!Enum.IsDefined(request.Status))
        {
            return BadRequest(new { message = "Unknown status." });
        }

        var order = _orders.GetById(id);

        if (order is null)
        {
            return NotFound(new { message = $"Order {id} does not exist." });
        }

        // 409: the request is well formed but conflicts with the order's current state.
        if (!_orders.TryChangeStatus(order, request.Status))
        {
            return Conflict(new { message = $"An order that is {order.Status} cannot move to {request.Status}." });
        }

        return order.ToDto();
    }
}
