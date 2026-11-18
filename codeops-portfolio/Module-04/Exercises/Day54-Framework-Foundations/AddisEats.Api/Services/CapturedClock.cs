namespace AddisEats.Api.Services;

// Captures the time ONCE, when the object is created. Reading it later never changes the value.
public class CapturedClock : IClock
{
    private readonly DateTime _createdAt = DateTime.UtcNow;

    public DateTime UtcNow => _createdAt;
}
