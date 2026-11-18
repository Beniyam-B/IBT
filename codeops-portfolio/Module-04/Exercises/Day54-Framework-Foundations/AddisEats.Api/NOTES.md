# Day 54 exercise notes

## Exercise 4: lifetimes (GET /api/v1/health/lifetime)

| Lifetime | Controller vs probe, same call | Call 1 vs call 2 | sameInstance |
|---|---|---|---|
| Transient | different values | changes | false |
| Scoped | identical values | changes | true |
| Singleton | identical values | never changes | true |

Explanation: A transient service is created every time something asks for it, so even two classes in the same request get different objects. A scoped service is created once per request and shared inside it, while a singleton is created once for the whole application and shared by every request.

## Exercise 7: a missing registration

I commented out `builder.Services.AddScoped<IPaymentProvider, CbeBirrProvider>();` and called GET /api/v1/payments/provider. The request failed with a 500 and this exception:

InvalidOperationException: Unable to resolve service for type 'AddisEats.Api.Payments.IPaymentProvider' while attempting to activate 'AddisEats.Api.Controllers.PaymentsController'.
System.InvalidOperationException: Unable to resolve service for type 'AddisEats.Api.Payments.IPaymentProvider' while attempting to activate 'AddisEats.Api.Controllers.PaymentsController'.
   at Microsoft.Extensions.DependencyInjection.ActivatorUtilities.ThrowHelperUnableToResolveService(Type type, Type requiredBy)
   at lambda_method3(Closure, IServiceProvider, Object[])
   at Microsoft.AspNetCore.Mvc.Controllers.ControllerFactoryProvider.<>c__DisplayClass6_0.<CreateControllerFactory>g__CreateController|0(ControllerContext controllerContext)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.InvokeInnerFilterAsync()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Diagnostics.DeveloperExceptionPageMiddlewareImpl.Invoke(HttpContext context)

HEADERS
=======
Accept: */*
Connection: keep-alive
Host: localhost:5106
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en-US,en;q=0.5
Referer: http://localhost:5106/swagger/index.html
sec-ch-ua-platform: "Windows"
sec-ch-ua: "Not-A.Brand";v="99", "Brave";v="157", "Chromium";v="157"
sec-ch-ua-mobile: ?0
Sec-GPC: 1
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
What it told me: it names the exact service type that was never registered and the controller that needed it, so the fix is to register that interface in Program.cs.
