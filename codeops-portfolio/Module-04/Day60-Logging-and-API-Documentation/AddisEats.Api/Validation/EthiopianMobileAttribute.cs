using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace AddisEats.Api.Validation;

// An Ethiopian mobile number: 09xxxxxxxx, 07xxxxxxxx, +2519xxxxxxxx or +2517xxxxxxxx.
// 09 is Ethio Telecom and 07 is Safaricom Ethiopia, so rejecting 07 would exclude a real network.
public class EthiopianMobileAttribute : ValidationAttribute
{
    // Compiled once and shared, not rebuilt on every request.
    private static readonly Regex Pattern = new(@"^(?:\+251|0)(?:9|7)\d{8}$", RegexOptions.Compiled);

    protected override ValidationResult? IsValid(object? value, ValidationContext context)
    {
        if (value is not string s || !Pattern.IsMatch(s))
        {
            return new ValidationResult("Enter a valid Ethiopian mobile number, such as 0911234567 or +251911234567.");
        }

        return ValidationResult.Success;
    }
}

