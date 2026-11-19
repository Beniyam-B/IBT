using AddisEats.Api.Dtos;
using AddisEats.Api.Mappers;
using AddisEats.Api.Queries;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.RestaurantServices;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // RestaurantsController -> api/v1/restaurants
public class RestaurantsController : ControllerBase
{
    private const int MaxLimit = 50;

    private readonly IRestaurantService _restaurants;
    private readonly IMenuService _menu;

    public RestaurantsController(IRestaurantService restaurants, IMenuService menu)
    {
        _restaurants = restaurants;
        _menu = menu;
    }

    // GET api/v1/restaurants?area=Bole&maxFeeEtb=55&page=1&limit=5
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetAll([FromQuery] RestaurantQuery q)
    {
        if (q.Page < 1 || q.Limit < 1 || q.Limit > MaxLimit)
        {
            return BadRequest(new { message = $"page must be 1 or more, and limit must be between 1 and {MaxLimit}." });
        }

        var results = _restaurants.GetAll(q)
                                  .Select(r => r.ToDto())
                                  .ToList();

        return Ok(new { data = results, page = q.Page, pageSize = q.Limit, total = _restaurants.CountAll(q) });
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
            return NotFound(new { message = $"Restaurant {id} does not exist." });
        }

        return Ok(found.ToDto());
    }

    // GET api/v1/restaurants/7/menu?category=Drinks
    [HttpGet("{id:int}/menu")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetMenu(int id, [FromQuery] string? category)
    {
        // The parent must exist before the child can.
        if (_restaurants.GetById(id) is null)
        {
            return NotFound(new { message = $"Restaurant {id} does not exist." });
        }

        var items = _menu.ForRestaurant(id, category)
                         .Select(m => m.ToDto())
                         .ToList();

        return Ok(items);   // 200, even when the list is empty
    }
}
