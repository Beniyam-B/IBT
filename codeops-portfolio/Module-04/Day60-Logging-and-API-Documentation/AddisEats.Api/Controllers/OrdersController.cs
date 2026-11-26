using AddisEats.Api.Dtos;
using AddisEats.Api.Mappers;
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
        var result = _orders.GetById(id);

        if (!result.IsSuccess)
        {
            return Fail(result);
        }

        return result.Value!.ToDto();
    }

    // POST api/v1/orders
    [HttpPost]
    [ProducesResponseType<OrderDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status422UnprocessableEntity)]
    public ActionResult<OrderDto> Create([FromBody] CreateOrderDto request)
    {
        // Layers 1 to 3 already passed, or we would not be here.
        var result = _orders.Place(request);

        if (!result.IsSuccess)
        {
            return Fail(result);
        }

        // 201 Created, with a Location header that points at GET api/v1/orders/{id}
        return CreatedAtAction(nameof(GetOne), new { id = result.Value!.Id }, result.Value.ToDto());
    }

    // PATCH api/v1/orders/2/status   body: { "status": "OnTheWay" }   (forward moves only)
    [HttpPatch("{id:int}/status")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public ActionResult<OrderDto> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto request)
    {
        var result = _orders.ChangeStatus(id, request.Status);

        if (!result.IsSuccess)
        {
            return Fail(result);
        }

        return result.Value!.ToDto();
    }

    // DELETE api/v1/orders/2   (cancels the order)
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public IActionResult Cancel(int id)
    {
        var result = _orders.Cancel(id);

        if (!result.IsSuccess)
        {
            return Fail(result);
        }

        return NoContent();   // 204: it worked and there is nothing to say
    }
}
