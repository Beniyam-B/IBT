using AddisEats.Api.Auth;
using AddisEats.Api.Options;
using AddisEats.Api.Payments;
using AddisEats.Api.Services;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Register services: what the app CAN do
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IClock, CapturedClock>();
builder.Services.AddTransient<LifetimeProbe>();
builder.Services.AddScoped<IPaymentProvider, CbeBirrProvider>();
builder.Services.Configure<DeliveryOptions>(builder.Configuration.GetSection(DeliveryOptions.SectionName));

builder.Services.AddAuthentication(DemoHeaderAuthHandler.SchemeName)
    .AddScheme<AuthenticationSchemeOptions, DemoHeaderAuthHandler>(DemoHeaderAuthHandler.SchemeName, _ => { });

var app = builder.Build();

// ---- 2. Build the pipeline: what happens to each request
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();   // who are you?
app.UseAuthorization();    // are you allowed?
app.MapControllers();

app.Run();
