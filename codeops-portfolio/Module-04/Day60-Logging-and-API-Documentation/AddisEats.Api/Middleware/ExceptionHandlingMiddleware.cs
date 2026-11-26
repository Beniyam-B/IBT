using AddisEats.Api.Common;

namespace AddisEats.Api.Middleware;

// Turns anything unhandled into a ProblemDetails. The detail goes to the log, never to the client.
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _log;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> log)
    {
        _next = next;
        _log = log;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex) when (!ctx.RequestAborted.IsCancellationRequested)
        {
            // Log once, here, with everything the server needs: the full exception, the route and a trace id.
            _log.LogError(ex, "Unhandled {Code} on {Method} {Path} for {Trace}",
                ErrorCatalogue.InternalError.Code, ctx.Request.Method, ctx.Request.Path, ctx.TraceIdentifier);

            if (ctx.Response.HasStarted)
            {
                throw;   // too late to change the response
            }

            // The caller's fault is a 400. Anything we did not anticipate is a 500 with a generic message.
            var error = ex is BadHttpRequestException ? ErrorCatalogue.ValidationFailed : ErrorCatalogue.InternalError;
            var detail = ex is BadHttpRequestException
                ? "The request could not be read."
                : "An unexpected error occurred. Quote the trace id if you contact support.";

            // No stack trace, no exception message, no table names.
            var problem = ProblemFactory.Build(error, detail, ctx);

            ctx.Response.Clear();
            ctx.Response.StatusCode = error.Status;
            await ctx.Response.WriteAsJsonAsync(problem, options: null, contentType: "application/problem+json");
        }
    }
}

