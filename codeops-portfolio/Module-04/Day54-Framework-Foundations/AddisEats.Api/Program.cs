using AddisEats.Api.Options;
using AddisEats.Api.Services.MenuServices;

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Register services: what the app CAN do
builder.Services.AddControllers();
builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MenuOptions>(builder.Configuration.GetSection(MenuOptions.SectionName));
builder.Services.AddScoped<IMenuService, MenuService>();

var app = builder.Build();

// ---- 2. Build the pipeline: what happens to each request
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
