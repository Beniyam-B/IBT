using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AddisEats.Api.Filters;

// Logs which action ran and what it was given. It must be a filter, not middleware, because the action name
// and the bound, validated arguments only exist after routing and model binding.
public class AuditActionFilter : IActionFilter
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() }
    };

    // Never written to a log, wherever they appear in an argument.
    private static readonly HashSet<string> Sensitive = new(StringComparer.OrdinalIgnoreCase)
    {
        "phone", "customerPhone", "password", "token", "apiKey"
    };

    private readonly ILogger<AuditActionFilter> _log;

    public AuditActionFilter(ILogger<AuditActionFilter> log)
    {
        _log = log;
    }

    public void OnActionExecuting(ActionExecutingContext ctx)
    {
        var arguments = ctx.ActionArguments.ToDictionary(a => a.Key, a => Redact(a.Value));

        _log.LogInformation("Action {Action} with {Arguments}",
            ctx.ActionDescriptor.DisplayName,
            JsonSerializer.Serialize(arguments, JsonOptions));
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

    private static JsonNode? Redact(object? value)
    {
        if (value is null)
        {
            return null;
        }

        var node = JsonSerializer.SerializeToNode(value, value.GetType(), JsonOptions);
        RedactNode(node);
        return node;
    }

    private static void RedactNode(JsonNode? node)
    {
        switch (node)
        {
            case JsonObject obj:
                foreach (var key in obj.Select(p => p.Key).ToList())
                {
                    if (Sensitive.Contains(key))
                    {
                        obj[key] = "***";
                    }
                    else
                    {
                        RedactNode(obj[key]);
                    }
                }
                break;

            case JsonArray array:
                foreach (var item in array)
                {
                    RedactNode(item);
                }
                break;
        }
    }
}
