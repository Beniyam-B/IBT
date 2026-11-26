using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Validation;

namespace AddisEats.Api.DTOs;

// The body a client sends to place an order. There is no total here: the server works it out.
public class CreateOrderDto : IValidatableObject
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
    [EthiopianMobile]
    public string Phone { get; set; } = "";

    public bool IsScheduled { get; set; }
    public DateTime? ScheduledFor { get; set; }

    // A rule across two fields. It runs after the property attributes, and only if they all passed.
    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (IsScheduled && ScheduledFor is null)
        {
            yield return new ValidationResult(
                "A delivery time is required when the order is scheduled.",
                new[] { nameof(ScheduledFor) });
        }

        if (IsScheduled && ScheduledFor is { } when && when <= DateTime.UtcNow)
        {
            yield return new ValidationResult(
                "The delivery time must be in the future.",
                new[] { nameof(ScheduledFor) });
        }

        if (!IsScheduled && ScheduledFor is not null)
        {
            yield return new ValidationResult(
                "scheduledFor is only allowed when isScheduled is true.",
                new[] { nameof(ScheduledFor) });
        }
    }
}

