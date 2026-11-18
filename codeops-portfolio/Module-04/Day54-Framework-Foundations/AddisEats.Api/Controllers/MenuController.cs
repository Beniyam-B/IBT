using AddisEats.Api.Dtos;
using AddisEats.Api.Entities;
using AddisEats.Api.Options;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // MenuController -> api/v1/menu
public class MenuController : ControllerBase
{
    private readonly IMenuService _menu;
    private readonly MenuOptions _options;

    public MenuController(IMenuService menu, IOptions<MenuOptions> options)
    {
        _menu = menu;
        _options = options.Value;
    }

    // GET api/v1/menu?category=Mains&maxPrice=300&page=1&limit=5
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? category,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int? limit = null)
    {
        int pageSize = limit ?? _options.DefaultPageSize;
        if (page < 1 || pageSize is < 1 or > 100)
        {
            return BadRequest(Error("INVALID_PAGING", "page must be 1 or more, and limit must be between 1 and 100."));
        }

        // A client may ask for a lower price ceiling, never a higher one than the configured maximum.
        decimal ceiling = Math.Min(maxPrice ?? _options.MaxPriceEtb, _options.MaxPriceEtb);

        var items = await _menu.SearchAsync(category, ceiling, page, pageSize);
        return Ok(new { data = items.Select(ToResponse), page, pageSize });
    }

    // GET api/v1/menu/7
    [HttpGet("{id:int}")]
    [ProducesResponseType<MenuItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOne(int id)
    {
        var item = await _menu.GetByIdAsync(id);
        return item is null
            ? NotFound(Error("NOT_FOUND", $"Menu item {id} does not exist."))
            : Ok(ToResponse(item));
    }

    // POST api/v1/menu
    [HttpPost]
    [ProducesResponseType<MenuItemResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateMenuItemRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest(Error("VALIDATION_FAILED", "Name and category are required."));
        }

        if (request.PriceEtb <= 0m)
        {
            return BadRequest(Error("VALIDATION_FAILED", "PriceEtb must be greater than zero."));
        }

        var created = await _menu.AddAsync(new MenuItem
        {
            Name = request.Name.Trim(),
            Category = request.Category.Trim(),
            PriceEtb = decimal.Round(request.PriceEtb, 2, MidpointRounding.AwayFromZero)
        });

        // 201 Created, with a Location header pointing at GET api/v1/menu/{id}
        return CreatedAtAction(nameof(GetOne), new { id = created.Id }, ToResponse(created));
    }

    private static MenuItemResponse ToResponse(MenuItem item) =>
        new(item.Id, item.Name, item.Category, item.PriceEtb);

    // The same error shape as Day 51, for every error.
    private static object Error(string code, string message) =>
        new { error = new { code, message } };
}
