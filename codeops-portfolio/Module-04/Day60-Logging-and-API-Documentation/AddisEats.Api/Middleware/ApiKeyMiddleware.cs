using System.Security.Cryptography;
using System.Text;
using AddisEats.Api.Common;
using AddisEats.Api.Configuration;
using Microsoft.Extensions.Options;

namespace AddisEats.Api.Middleware;

// Short-circuits with 401 unless the caller sends the right X-Api-Key. When it stops the request, nothing after it runs.
public class ApiKeyMiddleware
{
    public const string HeaderName = "X-Api-Key";

    private readonly RequestDelegate _next;
    private readonly string _expectedKey;   // IOptions is a singleton, so it is safe in the constructor

    public ApiKeyMiddleware(RequestDelegate next, IOptions<AdminOptions> options)
    {
        _next = next;
        _expectedKey = options.Value.ApiKey;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        var supplied = ctx.Request.Headers[HeaderName].FirstOrDefault();

        if (!IsValid(supplied))
        {
            var problem = ProblemFactory.Build(ErrorCatalogue.Unauthenticated, "A valid X-Api-Key header is required.", ctx);

            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            ctx.Response.Headers["WWW-Authenticate"] = "ApiKey";
            await ctx.Response.WriteAsJsonAsync(problem, options: null, contentType: "application/problem+json");
            return;   // the short-circuit: _next is never called
        }

        await _next(ctx);
    }

    private bool IsValid(string? supplied)
    {
        // No key configured means nobody gets in.
        if (string.IsNullOrEmpty(_expectedKey) || string.IsNullOrEmpty(supplied))
        {
            return false;
        }

        // A fixed-time comparison, so response timing cannot be used to guess the key.
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(supplied), Encoding.UTF8.GetBytes(_expectedKey));
    }
}

