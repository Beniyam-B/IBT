using AddisEats.Api.Mappers;
using AddisEats.Api.Services.RestaurantServices;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // RestaurantsController -> api/v1/restaurants
public class RestaurantsController : ControllerBase
{
    private const int MaxLimit = 50;

    private readonly IRestaurantService _restaurants;

    public RestaurantsController(IRestaurantService restaurants)
    {
        _restaurants = restaurants;
    }

    // GET api/v1/restaurants?area=Bole&page=1&limit=5
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetAll([FromQuery] string? area, [FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        if (page < 1 || limit < 1 || limit > MaxLimit)
        {
            return BadRequest(new { message = $"page must be 1 or more, and limit must be between 1 and {MaxLimit}." });
        }

        var results = _restaurants.GetAll(area, page, limit)
                                  .Select(r => r.ToDto())
                                  .ToList();

        return Ok(new { data = results, page, pageSize = limit, total = _restaurants.CountAll(area) });
    }

    // GET api/v1/restaurants/7
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetOne(int id)
    {
        var found = _restaurants.GetById(id);

        if (found is null)
        {
            return NotFound(new { message = $"Restaurant {id} does not exist." });   // 404, not 200 and not 500
        }

        return Ok(found.ToDto());
    }
}
