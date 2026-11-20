using Microsoft.AspNetCore.Mvc;

namespace AddisEats.Api.Errors;

// Builds the one error body every failure uses: a ProblemDetails (RFC 7807) plus a machine-readable "code".
public static class ProblemFactory
{
    public static ObjectResult Create(ApiError error, string detail, string instance, IDictionary<string, string[]>? errors = null)
    {
        ProblemDetails problem = errors is null
            ? new ProblemDetails()
            : new ValidationProblemDetails(errors);

        problem.Type = $"https://addiseats.et/errors/{error.Code.ToLowerInvariant().Replace('_', '-')}";
        problem.Title = error.Title;
        problem.Status = error.Status;
        problem.Detail = detail;
        problem.Instance = instance;
        problem.Extensions["code"] = error.Code;

        return new ObjectResult(problem)
        {
            StatusCode = error.Status,
            ContentTypes = { "application/problem+json", "application/json" }
        };
    }
}
