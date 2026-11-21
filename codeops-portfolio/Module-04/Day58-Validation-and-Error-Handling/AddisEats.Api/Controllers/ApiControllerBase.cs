using AddisEats.Api.Errors;
using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Controllers;

// Every controller inherits this, so there is exactly one way to fail.
public abstract class ApiControllerBase : ControllerBase
{
    protected ObjectResult Fail(ApiError error, string detail, IDictionary<string, string[]>? errors = null) =>
        ProblemFactory.Create(error, detail, Request.Path.Value ?? "", errors);
}
