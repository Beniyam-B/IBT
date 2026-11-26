using System.Text.RegularExpressions;

namespace AddisEats.Api.Middleware;

// Gives every request one id that follows it through every log line and comes back to the caller.
public class CorrelationIdMiddleware
{
    public const string HeaderName = "X-Correlation-Id";

    // Only a short, safe id from the caller is trusted. Anything else is replaced, so nobody can push junk into our logs.
    private static readonly Regex SafeId = new("^[A-Za-z0-9._-]{1,64}$", RegexOptions.Compiled);

    private readonly RequestDelegate _next;
    private readonly ILogger<CorrelationIdMiddleware> _log;   // ILogger is safe in the constructor: it is a singleton

    public CorrelationIdMiddleware(RequestDelegate next, ILogger<CorrelationIdMiddleware> log)
    {
        _next = next;
        _log = log;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        var incoming = ctx.Request.Headers[HeaderName].FirstOrDefault();
        var id = incoming is not null && SafeId.IsMatch(incoming) ? incoming : Guid.NewGuid().ToString("N");

        // The trace id in every error body (Day 58) is now this id.
        ctx.TraceIdentifier = id;

        // OnStarting runs just before the first byte is sent, so the header is still there
        // when the exception handler clears the response and writes its own error.
        ctx.Response.OnStarting(() =>
        {
            ctx.Response.Headers[HeaderName] = id;
            return Task.CompletedTask;
        });

        // Every log line written while the request is inside this block carries the id.
        using (_log.BeginScope("CorrelationId:{CorrelationId}", id))
        {
            await _next(ctx);
        }
    }
}
