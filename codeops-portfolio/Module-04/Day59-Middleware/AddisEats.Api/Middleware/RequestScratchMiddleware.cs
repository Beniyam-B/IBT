using AddisEats.Api.Services;

namespace AddisEats.Api.Middleware;

// Teaches the lifetime rule. The constructor only receives things that live as long as the app (RequestDelegate).
// The scoped service arrives in InvokeAsync, so the framework hands every request its own.
public class RequestScratchMiddleware
{
    private readonly RequestDelegate _next;

    public RequestScratchMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext ctx, IRequestScratch scratch)
    {
        scratch.Path = ctx.Request.Path.Value ?? "";
        await Task.Delay(2000);   // a slow step, so two requests overlap
        ctx.Response.Headers["X-Scratch-Id"] = scratch.Id.ToString("N");
        ctx.Response.Headers["X-Scratch-Path"] = scratch.Path;
        await _next(ctx);
    }
}
