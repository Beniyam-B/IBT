namespace AddisEats.Api.Options;

// Bound from the "Delivery" section of appsettings.json.
public class DeliveryOptions
{
    public const string SectionName = "Delivery";

    public decimal FreeAboveEtb { get; set; } = 1000m;
    public decimal DefaultFeeEtb { get; set; } = 65m;
}
