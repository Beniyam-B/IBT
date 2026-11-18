using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]   // SecureController -> api/v1/secure
[Authorize]                      // only identified callers get in
public class SecureController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { message = "You are in.", user = User.Identity?.Name });
}
