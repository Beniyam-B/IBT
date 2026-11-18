namespace AddisEats.Api.Options;

// Bound from the "Menu" section of appsettings.json.
public class MenuOptions
{
    public const string SectionName = "Menu";

    public int DefaultPageSize { get; set; } = 10;
    public decimal MaxPriceEtb { get; set; } = 500m;
}
