namespace AddisEats.Api.Configuration;

// Bound from the "Menu" section of appsettings.json.
public class MenuOptions
{
    public const string SectionName = "Menu";

    public int DefaultPageSize { get; set; } = 5;       // used when the caller sends no limit
    public decimal MaxPriceEtb { get; set; } = 500m;    // used when the caller sends no maxPrice
}

