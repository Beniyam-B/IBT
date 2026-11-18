using AddisEats.Api.Options;
using AddisEats.Api.Payments;
using AddisEats.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Register services: what the app CAN do
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IClock, CapturedClock>();
builder.Services.AddTransient<LifetimeProbe>();
builder.Services.AddScoped<IPaymentProvider, CbeBirrProvider>();
builder.Services.Configure<DeliveryOptions>(builder.Configuration.GetSection(DeliveryOptions.SectionName));

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
