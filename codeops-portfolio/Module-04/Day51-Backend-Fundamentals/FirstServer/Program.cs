// FirstServer: a tiny HTTP server in C#.
// Day 51 idea: a server is just a program that starts, listens on a port, and never exits.

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// An in-memory "database" for now. Module 5 replaces it with a real one.
var restaurants = new List<Restaurant>
{
    new(14, "Yod Abyssinia", "Bole"),
    new(21, "Kategna", "Kazanchis"),
    new(30, "Lucy Lounge", "Bole"),
};
var nextId = 31;

// GET /api/v1/restaurants?area=Bole  ->  200 + a list (the query string filters it)
app.MapGet("/api/v1/restaurants", (string? area) =>
{
    var items = restaurants
        .Where(r => area is null || r.Area.Equals(area, StringComparison.OrdinalIgnoreCase))
        .ToList();
    return Results.Ok(new { data = items, total = items.Count });
});

// GET /api/v1/restaurants/14  ->  200 + one restaurant, or 404 if it does not exist
app.MapGet("/api/v1/restaurants/{id:int}", (int id) =>
{
    var found = restaurants.FirstOrDefault(r => r.Id == id);
    return found is null ? NotFound(id) : Results.Ok(found);
});

// POST /api/v1/restaurants  ->  201 + a Location header, or 400 if the body is invalid
app.MapPost("/api/v1/restaurants", (NewRestaurant input) =>
{
    var problems = new List<object>();
    if (string.IsNullOrWhiteSpace(input.Name)) problems.Add(new { field = "name", issue = "is required" });
    if (string.IsNullOrWhiteSpace(input.Area)) problems.Add(new { field = "area", issue = "is required" });
    if (problems.Count > 0)
    {
        return Results.BadRequest(new
        {
            error = new { code = "VALIDATION_FAILED", message = "The request was invalid.", details = problems }
        });
    }

    var created = new Restaurant(nextId++, input.Name!.Trim(), input.Area!.Trim());
    restaurants.Add(created);
    return Results.Created($"/api/v1/restaurants/{created.Id}", created);
});

// DELETE /api/v1/restaurants/14  ->  204 No Content (nothing to return), or 404
app.MapDelete("/api/v1/restaurants/{id:int}", (int id) =>
{
    var removed = restaurants.RemoveAll(r => r.Id == id);
    return removed == 0 ? NotFound(id) : Results.NoContent();
});

app.Run();

// Every error has the same JSON shape, so a client can handle them all the same way.
static IResult NotFound(int id) =>
    Results.NotFound(new { error = new { code = "NOT_FOUND", message = $"Restaurant {id} does not exist." } });

record Restaurant(int Id, string Name, string Area);
record NewRestaurant(string? Name, string? Area);
