namespace AddisEats.Api.Queries;

// Everything a client can ask of the restaurant list. Binding is by property name: ?maxFeeEtb=55 fills MaxFeeEtb.
public class RestaurantQuery
{
    public string? Area { get; set; }
    public decimal? MaxFeeEtb { get; set; }   // null means "not supplied": 0 is a real fee
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 20;
}
