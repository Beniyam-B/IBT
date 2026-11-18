namespace AddisEats.Api.Services;

// A second class that also asks for an IClock, so we can compare it with the controller's.
public class LifetimeProbe
{
    public IClock Clock { get; }

    public LifetimeProbe(IClock clock)
    {
        Clock = clock;
    }
}
