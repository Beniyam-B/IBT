using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

namespace AddisEats.Api.Dtos;

// The body a client sends to create a menu item. It has no Id: the server chooses it.
public class CreateMenuItemDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2 to 100 characters.")]
    public string Name { get; set; } = "";

    [Required(ErrorMessage = "Category is required.")]
    [StringLength(50, ErrorMessage = "Category can be at most 50 characters.")]
    public string Category { get; set; } = "";

    [EtbAmount]
    public decimal PriceEtb { get; set; }
}
