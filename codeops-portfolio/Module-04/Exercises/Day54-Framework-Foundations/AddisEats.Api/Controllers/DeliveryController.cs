using AddisEats.Api.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // DeliveryController -> api/v1/delivery
public class DeliveryController : ControllerBase
{
    private readonly DeliveryOptions _options;

    public DeliveryController(IOptions<DeliveryOptions> options)
    {
        _options = options.Value;
    }

    // GET api/v1/delivery/options
    [HttpGet("options")]
    public IActionResult GetOptions() =>
        Ok(new { freeAboveEtb = _options.FreeAboveEtb, defaultFeeEtb = _options.DefaultFeeEtb });
}
