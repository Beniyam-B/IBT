using AddisEats.Api.Options;
using AddisEats.Api.Services.MenuServices;
using AddisEats.Api.Services.RestaurantServices;

const string FrontendPolicy = "frontend";

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Register services: what the app CAN do
builder.Services.AddControllers();
builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MenuOptions>(builder.Configuration.GetSection(MenuOptions.SectionName));
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();

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
