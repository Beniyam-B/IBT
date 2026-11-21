using System.ComponentModel.DataAnnotations;

namespace AddisEats.Api.Validation;

// An ETB amount: a decimal above zero with at most two decimal places. 480.505 ETB cannot be paid.
public class EtbAmountAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext context)
    {
        if (value is not decimal amount)
        {
            return new ValidationResult("Enter the amount in ETB as a number.");
        }

        if (amount <= 0m)
        {
            return new ValidationResult("The amount must be above zero.");
        }

        if (decimal.Round(amount, 2) != amount)
        {
            return new ValidationResult("The amount can have at most two decimal places.");
        }

        return ValidationResult.Success;
    }
}
