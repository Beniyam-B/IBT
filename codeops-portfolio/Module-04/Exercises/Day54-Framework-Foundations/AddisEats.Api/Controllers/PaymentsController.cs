using AddisEats.Api.Payments;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // PaymentsController -> api/v1/payments
public class PaymentsController : ControllerBase
{
    private readonly IPaymentProvider _provider;

    // Depends on the interface only. It has no idea which provider it is getting.
    public PaymentsController(IPaymentProvider provider)
    {
        _provider = provider;
    }

    // GET api/v1/payments/provider
    [HttpGet("provider")]
    public IActionResult GetProvider() =>
        Ok(new { provider = _provider.Name, charged = _provider.Charge("0911000000", 100m) });
}
