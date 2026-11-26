namespace AddisEats.Api.Options;

// Bound from the "Admin" section. The real key is never committed: set the Admin__ApiKey environment variable.
public class AdminOptions
{
    public const string SectionName = "Admin";

    public string ApiKey { get; set; } = "";
}
