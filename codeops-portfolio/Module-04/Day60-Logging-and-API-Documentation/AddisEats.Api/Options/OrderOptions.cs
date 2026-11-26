namespace AddisEats.Api.Options;

// Bound from the "Orders" section of appsettings.json.
public class OrderOptions
{
    public const string SectionName = "Orders";

    public decimal MinimumOrderEtb { get; set; } = 150m;   // items plus delivery
}
