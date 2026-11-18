using AddisEats.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IClock _clock;
    private readonly LifetimeProbe _probe;

    public HealthController(IWebHostEnvironment env, IClock clock, LifetimeProbe probe)
    {
        _env = env;
        _clock = clock;
        _probe = probe;
    }

    [HttpGet]
    public IActionResult Get() =>
        Ok(new { status = "ok", utcNow = _clock.UtcNow, environment = _env.EnvironmentName });

    // GET api/v1/health/lifetime: the controller and the probe each hold an IClock. Are they the same object?
    [HttpGet("lifetime")]
    public IActionResult Lifetime() =>
        Ok(new
        {
            controllerClock = _clock.UtcNow.ToString("HH:mm:ss.ffffff"),
            probeClock = _probe.Clock.UtcNow.ToString("HH:mm:ss.ffffff"),
            sameInstance = ReferenceEquals(_clock, _probe.Clock)
        });
}
