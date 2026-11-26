using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AddisEats.Api.Common.Filters;

// Logs which action ran and with which ids. It must be a filter, not middleware, because the action name and the
// bound arguments only exist after routing and model binding.
//
// Policy: a request body is never logged, and neither is any free text a client typed. Only numeric, boolean and
// enum arguments (ids, paging, flags) are written. Everything else is named as withheld, never printed.
public class AuditActionFilter : IActionFilter
{
    private readonly ILogger<AuditActionFilter> _log;

    public AuditActionFilter(ILogger<AuditActionFilter> log)
    {
        _log = log;
    }

    public void OnActionExecuting(ActionExecutingContext ctx)
    {
        var safe = ctx.ActionArguments
            .Where(a => a.Value is int or long or decimal or bool or Enum)
            .ToDictionary(a => a.Key, a => a.Value);

        var withheld = ctx.ActionArguments.Keys.Except(safe.Keys).ToList();

        _log.LogInformation("Action {Action} with {Arguments}, withheld: {Withheld}",
            ctx.ActionDescriptor.DisplayName,
            JsonSerializer.Serialize(safe),
            string.Join(",", withheld));
    }

    public void OnActionExecuted(ActionExecutedContext ctx)
    {
        if (ctx.Exception is not null)
        {
            // The exception itself is logged by the exception middleware. Here only its type, never its message.
            _log.LogWarning("Action {Action} threw {ExceptionType}", ctx.ActionDescriptor.DisplayName, ctx.Exception.GetType().Name);
            return;
        }

        var status = ctx.Result switch
        {
            ObjectResult { StatusCode: { } code } => code,
            ObjectResult => StatusCodes.Status200OK,
            StatusCodeResult s => s.StatusCode,
            _ => StatusCodes.Status200OK
        };

        _log.LogInformation("Action {Action} finished with {Status}", ctx.ActionDescriptor.DisplayName, status);
    }
}
