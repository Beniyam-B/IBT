namespace AddisEats.Api.Services;

// The real clock: asks the system for the time on every read.
public class RealClock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}
