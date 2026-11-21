using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Errors;

// Builds the one error body every failure uses: a ProblemDetails (RFC 7807) plus a machine-readable "code" and a traceId.
public static class ProblemFactory
{
    // The ProblemDetails itself, so controllers and the exception middleware share exactly one shape.
    public static ProblemDetails Build(ApiError error, string detail, HttpContext http, IDictionary<string, string[]>? errors = null)
    {
        ProblemDetails problem = errors is null
            ? new ProblemDetails()
            : new ValidationProblemDetails(errors.ToDictionary(e => CamelCase(e.Key), e => e.Value));

        problem.Type = $"https://addiseats.et/errors/{error.Code.ToLowerInvariant().Replace('_', '-')}";
        problem.Title = error.Title;
        problem.Status = error.Status;
        problem.Detail = detail;
        problem.Instance = http.Request.Path.Value ?? "";
        problem.Extensions["code"] = error.Code;
        problem.Extensions["traceId"] = http.TraceIdentifier;

        return problem;
    }

    public static ObjectResult Create(ApiError error, string detail, HttpContext http, IDictionary<string, string[]>? errors = null) =>
        new(Build(error, detail, http, errors))
        {
            StatusCode = error.Status,
            ContentTypes = { "application/problem+json", "application/json" }
        };

    // Field names go out the way the JSON does: restaurantId, not RestaurantId.
    private static string CamelCase(string key) =>
        string.IsNullOrEmpty(key) || !char.IsUpper(key[0]) ? key : char.ToLowerInvariant(key[0]) + key[1..];
}
