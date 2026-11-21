using System.Text.Json;
using System.Text.Json.Serialization;
using AddisEats.Api.Errors;
using AddisEats.Api.Filters;
using AddisEats.Api.Options;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.OrderServices;
using AddisEats.Api.Services.RestaurantServices;

const string FrontendPolicy = "frontend";

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Register services: what the app CAN do
builder.Services.AddControllers(options => options.Filters.Add<RejectUnknownQueryParametersFilter>())
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
                        .Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage) ? "The value is invalid." : e.ErrorMessage)
                        .ToArray());

            return ProblemFactory.Create(
                ErrorCatalogue.ValidationFailed,
                "One or more fields are missing or malformed.",
                context.HttpContext.Request.Path.Value ?? "",
                errors);
        };
    })
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MenuOptions>(builder.Configuration.GetSection(MenuOptions.SectionName));
builder.Services.Configure<OrderOptions>(builder.Configuration.GetSection(OrderOptions.SectionName));
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// CORS: only the origins we trust (5173 = Vite, 3000 = Next.js / Create React App).
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendPolicy, policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// ---- 2. Build the pipeline: what happens to each request
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(FrontendPolicy);   // before UseAuthorization and MapControllers
app.UseAuthorization();
app.MapControllers();

app.Run();


