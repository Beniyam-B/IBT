using AddisEats.Api.Errors;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AddisEats.Api.Filters;

// Runs before every action. A query parameter the action does not declare is a 400, not silently ignored.
public class RejectUnknownQueryParametersFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var accepted = AcceptedNames(context.ActionDescriptor);

        var unknown = context.HttpContext.Request.Query.Keys
            .Where(key => !accepted.Contains(key))
            .ToList();

        if (unknown.Count == 0)
        {
            return;
        }

        var list = accepted.Count == 0 ? "none" : string.Join(", ", accepted.OrderBy(name => name));

        context.Result = ProblemFactory.Create(
            ErrorCatalogue.UnknownParameter,
            $"Unknown query parameter(s): {string.Join(", ", unknown)}. This endpoint accepts: {list}.",
            context.HttpContext.Request.Path.Value ?? "");
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }

    // The accepted names are the action's own query-bound parameters (and the properties of a query object).
    private static HashSet<string> AcceptedNames(ActionDescriptor action)
    {
        var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var parameter in action.Parameters)
        {
            var info = parameter.BindingInfo;

            if (info?.BindingSource != BindingSource.Query)
            {
                continue;   // route values and the body are not query parameters
            }

            var type = Nullable.GetUnderlyingType(parameter.ParameterType) ?? parameter.ParameterType;

            if (IsSimple(type))
            {
                names.Add(info!.BinderModelName ?? parameter.Name);
            }
            else
            {
                foreach (var property in type.GetProperties())
                {
                    names.Add(property.Name);
                }
            }
        }

        return names;
    }

    private static bool IsSimple(Type type) =>
        type.IsPrimitive || type.IsEnum || type == typeof(string) || type == typeof(decimal)
        || type == typeof(DateTime) || type == typeof(Guid);
}
