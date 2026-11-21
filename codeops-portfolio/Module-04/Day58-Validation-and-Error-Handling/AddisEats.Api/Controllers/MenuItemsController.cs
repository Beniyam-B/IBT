using AddisEats.Api.Dtos;
using AddisEats.Api.Errors;
using AddisEats.Api.Mappers;
using AddisEats.Api.Models;
using AddisEats.Api.Options;
using AddisEats.Api.Services.MenuServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/menu-items")]   // a plural, hyphenated noun
public class MenuItemsController : ApiControllerBase
{
    private const int MaxPageSize = 50;

    private readonly IMenuService _menu;
    private readonly MenuOptions _options;

    public MenuItemsController(IMenuService menu, IOptions<MenuOptions> options)
    {
        _menu = menu;
        _options = options.Value;
    }

    // GET api/v1/menu-items?category=Drinks&maxPrice=100&page=1&limit=5
    [HttpGet]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public ActionResult<PagedResponse<MenuItemDto>> GetAll(
        [FromQuery] string? category,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int? limit = null)
    {
        int pageSize = limit ?? _options.DefaultPageSize;

        if (page < 1 || pageSize < 1 || pageSize > MaxPageSize)
        {
            return Fail(ErrorCatalogue.InvalidPaging, $"page must be 1 or more, and limit must be between 1 and {MaxPageSize}.");
        }

        decimal ceiling = maxPrice ?? _options.MaxPriceEtb;
        var results = _menu.GetAll(category, ceiling, page, pageSize);

        return Ok(new PagedResponse<MenuItemDto>(
            results.Select(m => m.ToDto()).ToList(), page, pageSize, _menu.CountAll(category, ceiling)));
    }

    // GET api/v1/menu-items/7
    [HttpGet("{id:int}")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public ActionResult<MenuItemDto> GetById(int id)
    {
        var item = _menu.GetById(id);

        if (item is null)
        {
            return Fail(ErrorCatalogue.MenuItemNotFound, $"Menu item {id} does not exist.");
        }

        return item.ToDto();
    }

    // POST api/v1/menu-items
    [HttpPost]
    [ProducesResponseType<MenuItemDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status422UnprocessableEntity)]
    public ActionResult<MenuItemDto> Create([FromBody] CreateMenuItemDto request)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            errors["name"] = new[] { "Name is required." };
        }

        if (string.IsNullOrWhiteSpace(request.Category))
        {
            errors["category"] = new[] { "Category is required." };
        }

        if (errors.Count > 0)
        {
            return Fail(ErrorCatalogue.ValidationFailed, "One or more fields are missing or malformed.", errors);
        }

        // Parsed fine but breaks a business rule: 422, not 400.
        if (request.PriceEtb <= 0m)
        {
            return Fail(ErrorCatalogue.AmountInvalid, "PriceEtb must be greater than zero.");
        }

        var created = _menu.Add(new MenuItem
        {
            Name = request.Name.Trim(),
            Category = request.Category.Trim(),
            PriceEtb = request.PriceEtb
        });

        // 201 Created, with a Location header that points at GET api/v1/menu-items/{id}
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }
}
