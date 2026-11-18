using System.Globalization;

// Mini-project: five top-ups in one run, one line per customer, then a grand total.
// (Day 53 teaches methods, which will remove the repeated calculation below.)
CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;

const int CustomerCount = 5;
const decimal MaxTopUp = 5000m;
const decimal ExtraThreshold = 1000m;
const decimal ExtraBonus = 20m;

var lines = new List<string>();
decimal grandTotal = 0m;
var credits = new List<decimal>();   // the credit for every accepted top-up
decimal totalAmount = 0m;
decimal totalBonus = 0m;
int accepted = 0;

for (int i = 1; i <= CustomerCount; i++)
{
    Console.WriteLine($"--- Customer {i} of {CustomerCount} ---");

    Console.Write("Customer name: ");
    string name = (Console.ReadLine() ?? "").Trim();
    if (name.Length == 0) name = "Customer";

    Console.Write("Mobile network (Ethio Telecom / Safaricom): ");
    string network = (Console.ReadLine() ?? "").Trim();
    if (network.Length == 0) network = "Unknown";

    Console.Write("Top-up amount in ETB: ");
    string? entry = Console.ReadLine();

    // A bad entry skips this customer, it does not stop the whole run.
    if (!decimal.TryParse(entry, out decimal amount))
    {
        lines.Add($"{i}. {name,-16}{network,-15}{"REJECTED: not a number",32}");
        continue;
    }

    amount = decimal.Round(amount, 2, MidpointRounding.AwayFromZero);

    if (amount <= 0m || amount > MaxTopUp)
    {
        lines.Add($"{i}. {name,-16}{network,-15}{"REJECTED: outside 0 - 5,000",32}");
        continue;
    }

    decimal rate = network.ToLowerInvariant() switch
    {
        "ethio telecom" => 0.05m,
        "safaricom"     => 0.03m,
        _               => 0m
    };

    decimal bonus = decimal.Round(amount * rate, 2, MidpointRounding.AwayFromZero);
    if (amount >= ExtraThreshold)
    {
        bonus += ExtraBonus;
    }

    decimal credit = amount + bonus;
    credits.Add(credit);
    totalAmount += amount;
    totalBonus += bonus;
    accepted++;

    lines.Add($"{i}. {name,-16}{network,-15}{amount,10:N2}{bonus,10:N2}{credit,12:N2}");
}

foreach (decimal c in credits) grandTotal += c;

Console.WriteLine();
Console.WriteLine($"{"",-3}{"Name",-16}{"Network",-15}{"Amount",10}{"Bonus",10}{"Credit",12}");
foreach (string line in lines)
{
    Console.WriteLine(line);
}
Console.WriteLine(new string('-', 66));
Console.WriteLine($"{"",-3}{"TOTAL",-16}{"",-15}{totalAmount,10:N2}{totalBonus,10:N2}{grandTotal,12:N2}");
Console.WriteLine($"{accepted} of {CustomerCount} accepted, {CustomerCount - accepted} rejected.");
