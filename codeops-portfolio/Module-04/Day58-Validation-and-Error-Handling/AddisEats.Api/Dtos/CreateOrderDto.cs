using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Dtos;

// The body a client sends to place an order. There is no total here: the server works it out.
public class CreateOrderDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Choose a restaurant: restaurantId must be 1 or more.")]
    public int RestaurantId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Choose a menu item: menuItemId must be 1 or more.")]
    public int MenuItemId { get; set; }

    [Range(1, 50, ErrorMessage = "Quantity must be between 1 and 50.")]
    public int Quantity { get; set; }

    [Required(ErrorMessage = "A phone number is required.")]
    [MinLength(10, ErrorMessage = "A phone number has at least 10 characters.")]
    [StringLength(13, ErrorMessage = "A phone number has at most 13 characters.")]
    public string Phone { get; set; } = "";
}
