using System.Diagnostics;

namespace AddisEats.Api.Middleware;

// Measures how long everything below it in the pipeline takes, and logs one line per request.
public class RequestTimingMiddleware
{
    private const long SlowRequestMs = 1000;

    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _log;

    public RequestTimingMiddleware(RequestDelegate next, ILogger<RequestTimingMiddleware> log)
    {
        _next = next;
        _log = log;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        var sw = Stopwatch.StartNew();
        var failed = false;

        try
        {
            await _next(ctx);
        }
        catch
        {
            failed = true;
            throw;   // the exception handler above us turns it into a 500 response
        }
        finally
        {
            sw.Stop();
            var ms = sw.ElapsedMilliseconds;

            // If it threw, no status has been set yet, so report what the caller will receive: 500.
            var status = failed ? StatusCodes.Status500InternalServerError : ctx.Response.StatusCode;

            // Everything at Information is noise. A slow request gets its own level so it can be found in one search.
            var level = ms > SlowRequestMs ? LogLevel.Warning : LogLevel.Information;

            // The path only: query strings can carry personal data.
            _log.Log(level, "{Method} {Path} -> {Status} in {Ms}ms",
                ctx.Request.Method, ctx.Request.Path.Value, status, ms);
        }
    }
}
