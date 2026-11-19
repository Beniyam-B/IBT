using AddisEats.Api.Dtos;
using AddisEats.Api.Mappers;
using AddisEats.Api.Models;
using AddisEats.Api.Options;
using AddisEats.Api.Services.MenuServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // MenuController -> api/v1/menu
public class MenuController : ControllerBase
{
    private const int MaxPageSize = 50;

    private readonly IMenuService _menu;
    private readonly MenuOptions _options;

    // Both arguments are supplied by the DI container. Nothing here calls new.
    public MenuController(IMenuService menu, IOptions<MenuOptions> options)
    {
        _menu = menu;
        _options = options.Value;
    }

    // GET api/v1/menu?category=Breakfast&maxPrice=200&page=1&limit=5
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetAll(
        [FromQuery] string? category,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int? limit = null)
    {
        int pageSize = limit ?? _options.DefaultPageSize;

        if (page < 1 || pageSize < 1 || pageSize > MaxPageSize)
        {
            return BadRequest(new { message = $"page must be 1 or more, and limit must be between 1 and {MaxPageSize}." });
        }

        decimal ceiling = maxPrice ?? _options.MaxPriceEtb;
        var results = _menu.GetAll(category, ceiling, page, pageSize);

        return Ok(new { data = results.Select(m => m.ToDto()).ToList(), page, pageSize });
    }

    // GET api/v1/menu/7
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetById(int id)
    {
        var item = _menu.GetById(id);

        if (item is null)
        {
            return NotFound(new { message = $"Menu item {id} does not exist." });
        }

        return Ok(item.ToDto());
    }

    // POST api/v1/menu
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Create([FromBody] CreateMenuItemDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest(new { message = "Name and category are required." });
        }

        if (request.PriceEtb <= 0m)
        {
            return BadRequest(new { message = "PriceEtb must be greater than zero." });
        }

        var created = _menu.Add(new MenuItem
        {
            Name = request.Name.Trim(),
            Category = request.Category.Trim(),
            PriceEtb = request.PriceEtb
        });

        // 201 Created, with a Location header that points at GET api/v1/menu/{id}
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }
}

