using System.Text.Json;
using System.Text.Json.Serialization;
using AddisEats.Api.Errors;
using AddisEats.Api.Filters;
using AddisEats.Api.Middleware;
using AddisEats.Api.Options;
using AddisEats.Api.Services;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.OrderServices;
using AddisEats.Api.Services.RestaurantServices;

const string FrontendPolicy = "frontend";

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Register services: what the app CAN do
builder.Services.AddControllers(options =>
    {
        options.Filters.Add<RejectUnknownQueryParametersFilter>();   // first: a rejected request never reaches the audit
        options.Filters.Add<AuditActionFilter>();
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        // Binding and parsing failures use the same error shape as every other failure.
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(entry => entry.Value is { Errors.Count: > 0 })
                .ToDictionary(
                    entry => entry.Key,
                    entry => entry.Value!.Errors
                        .Select(e => !string.IsNullOrWhiteSpace(e.ErrorMessage)
                            ? e.ErrorMessage
                            : e.Exception is JsonException
                                ? "The request body is malformed, has a value of the wrong type, or has a field this endpoint does not accept."
                                : "The value is invalid.")
                        .ToArray());

            return ProblemFactory.Create(
                ErrorCatalogue.ValidationFailed,
                "One or more fields are missing or malformed.",
                context.HttpContext,
                errors);
        };
    })
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow;   // a field we do not know is a 400
    });

builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MenuOptions>(builder.Configuration.GetSection(MenuOptions.SectionName));
builder.Services.Configure<OrderOptions>(builder.Configuration.GetSection(OrderOptions.SectionName));
builder.Services.Configure<AdminOptions>(builder.Configuration.GetSection(AdminOptions.SectionName));
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IRequestScratch, RequestScratch>();

// CORS: only the origins we trust (5173 = Vite, 3000 = Next.js / Create React App).
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendPolicy, policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// ---- 2. The pipeline, top to bottom. The order is the design.
app.UseMiddleware<ExceptionHandlingMiddleware>();   // outermost: it can report a failure in anything below it
app.UseMiddleware<CorrelationIdMiddleware>();       // the id exists before anything logs
app.UseMiddleware<RequestTimingMiddleware>();       // measures everything below it, so it comes early

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Development only: a deliberate throw, to prove the handler works. Hidden from Swagger.
    app.MapGet("/api/v1/debug/throw", IResult () => throw new InvalidOperationException("boom: Server=secret-db;Password=hunter2"))
       .ExcludeFromDescription();

    // Development only: a slow route, to see the Warning from the timing middleware.
    app.MapGet("/api/v1/debug/slow", async (int? ms) =>
    {
        var wait = Math.Clamp(ms ?? 1500, 0, 5000);
        await Task.Delay(wait);
        return Results.Ok(new { waitedMs = wait });
    }).ExcludeFromDescription();
}

app.UseHttpsRedirection();
app.UseCors(FrontendPolicy);   // before routing, so a preflight request is answered

// A branch: only requests whose path starts with /admin enter it. Everything else carries on down the main pipeline.
app.Map("/admin", admin =>
{
    admin.UseMiddleware<ApiKeyMiddleware>();   // runs first inside the branch and stops the request if the key is wrong

    // The terminal step of the branch. If the key middleware short-circuits, this line never appears in the log.
    admin.Run(async ctx =>
    {
        var log = ctx.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("Admin");
        log.LogInformation("admin handler ran");

        await ctx.Response.WriteAsJsonAsync(new
        {
            restaurants = AddisEats.Api.Data.SeedData.Restaurants.Count,
            menuItems = AddisEats.Api.Data.SeedData.MenuItems.Count,
            orders = AddisEats.Api.Data.SeedData.Orders.Count
        });
    });
});
// Lab (exercise 5), never in Production: shows how a scoped service behaves inside middleware.
if (app.Environment.IsDevelopment())
{
    app.Map("/lab", lab =>
    {
        lab.UseMiddleware<RequestScratchMiddleware>();
        lab.Run(ctx => ctx.Response.WriteAsync("lab ok"));
    });
}

app.UseRouting();              // decides which endpoint matches, without running it
// app.UseRateLimiter();       // Day 63: after routing, so limits can differ per endpoint
// app.UseAuthentication();    // Day 61: who is the caller
// app.UseAuthorization();     // Day 62: may they proceed
app.MapControllers();          // runs the endpoint: terminal, nothing after it ever executes

app.Run();




