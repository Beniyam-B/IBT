using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IClock _clock;

    // The framework supplies both arguments. Nothing here calls new.
    public HealthController(IWebHostEnvironment env, IClock clock)
    {
        _env = env;
        _clock = clock;
    }

    [HttpGet]
    public IActionResult Get() =>
        Ok(new { status = "ok", utcNow = _clock.UtcNow, environment = _env.EnvironmentName });
}
