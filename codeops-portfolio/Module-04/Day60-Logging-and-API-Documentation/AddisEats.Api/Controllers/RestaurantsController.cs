using AddisEats.Api.Common;
using AddisEats.Api.DTOs;
using AddisEats.Api.Mappers;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.RestaurantServices;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // RestaurantsController -> api/v1/restaurants
public class RestaurantsController : ApiControllerBase
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
    [ProducesResponseType<PagedResponse<RestaurantDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status500InternalServerError)]
    public ActionResult<PagedResponse<RestaurantDto>> GetAll([FromQuery] RestaurantQuery q)
    {
        if (q.Page < 1 || q.Limit < 1 || q.Limit > MaxLimit)
        {
            return Fail(ErrorCatalogue.InvalidPaging, $"page must be 1 or more, and limit must be between 1 and {MaxLimit}.");
        }

        var results = _restaurants.GetAll(q)
                                  .Select(r => r.ToDto())
                                  .ToList();

        return Ok(new PagedResponse<RestaurantDto>(results, q.Page, q.Limit, _restaurants.CountAll(q)));
    }

    // GET api/v1/restaurants/7
    [HttpGet("{id:int}")]
    [ProducesResponseType<RestaurantDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status500InternalServerError)]
    public ActionResult<RestaurantDto> GetOne(int id)
    {
        var found = _restaurants.GetById(id);

        if (found is null)
        {
            return Fail(ErrorCatalogue.RestaurantNotFound, $"Restaurant {id} does not exist.");
        }

        return found.ToDto();
    }

    // GET api/v1/restaurants/7/menu?category=Drinks&page=1&limit=20
    [HttpGet("{id:int}/menu")]
    [ProducesResponseType<PagedResponse<MenuItemDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status500InternalServerError)]
    public ActionResult<PagedResponse<MenuItemDto>> GetMenu(
        int id,
        [FromQuery] string? category,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        // The parent must exist before the child can.
        if (_restaurants.GetById(id) is null)
        {
            return Fail(ErrorCatalogue.RestaurantNotFound, $"Restaurant {id} does not exist.");
        }

        if (page < 1 || limit < 1 || limit > MaxLimit)
        {
            return Fail(ErrorCatalogue.InvalidPaging, $"page must be 1 or more, and limit must be between 1 and {MaxLimit}.");
        }

        var all = _menu.ForRestaurant(id, category);

        var items = all.Skip((page - 1) * limit)
                       .Take(limit)
                       .Select(m => m.ToDto())
                       .ToList();

        return Ok(new PagedResponse<MenuItemDto>(items, page, limit, all.Count));   // 200 even when empty
    }
}
