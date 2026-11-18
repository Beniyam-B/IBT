using AddisEats.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Register services: what the app CAN do
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IClock, CapturedClock>();   // experiment: transient, scoped, singleton
builder.Services.AddTransient<LifetimeProbe>();

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
