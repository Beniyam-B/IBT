using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.DTOs;

// Everything a client can ask of the restaurant list.
public class RestaurantQuery
{
    [StringLength(50, ErrorMessage = "Area can be at most 50 characters.")]
    public string? Area { get; set; }

    public List<string> Areas { get; set; } = new();   // ?areas=Bole&areas=Ayat; an empty list means no filter

    [Range(0, 10000, ErrorMessage = "maxFeeEtb must be between 0 and 10,000.")]
    public decimal? MaxFeeEtb { get; set; }            // null means "not supplied": 0 is a real fee

    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 20;
}

