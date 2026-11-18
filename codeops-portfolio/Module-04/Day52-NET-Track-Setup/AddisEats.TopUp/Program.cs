using System.Globalization;

// Pin the culture so "1,000.50" is read and printed the same way on every machine.
CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;

const decimal MaxTopUp = 5000m;
const decimal ExtraThreshold = 1000m;
const decimal ExtraBonus = 20m;

Console.WriteLine("=== TeleBirr Top-Up Calculator ===");

Console.Write("Customer name: ");
string name = (Console.ReadLine() ?? "").Trim();
if (name.Length == 0) name = "Customer";

Console.Write("Mobile network (Ethio Telecom / Safaricom): ");
string network = (Console.ReadLine() ?? "").Trim();
if (network.Length == 0) network = "Unknown";

Console.Write("Top-up amount in ETB: ");
string? entry = Console.ReadLine();

// Guard clauses: reject bad input first, then the rest of the program can trust its values.
if (!decimal.TryParse(entry, out decimal amount))
{
    Console.WriteLine("Rejected: that is not a number.");
    return;
}

// ETB has two decimal places (santim). Round once, then check the value we will really use.
amount = decimal.Round(amount, 2, MidpointRounding.AwayFromZero);

if (amount <= 0m)
{
    Console.WriteLine("Rejected: the amount must be greater than zero.");
    return;
}

if (amount > MaxTopUp)
{
    Console.WriteLine($"Rejected: the maximum top-up is {MaxTopUp:N2} ETB.");
    return;
}

// Switch expression: the network decides the bonus rate. Every value stays decimal (note the m).
decimal rate = network.ToLowerInvariant() switch
{
    "ethio telecom" => 0.05m,
    "safaricom"     => 0.03m,
    _               => 0m
};

decimal bonus = decimal.Round(amount * rate, 2, MidpointRounding.AwayFromZero);

bool getsExtra = amount >= ExtraThreshold;
if (getsExtra)
{
    bonus += ExtraBonus;
}

decimal credit = amount + bonus;

Console.WriteLine();
Console.WriteLine("----------- RECEIPT -----------");
Console.WriteLine($"{"Name",-14}{name}");
Console.WriteLine($"{"Network",-14}{network}");
Console.WriteLine($"{"Amount",-14}{amount,12:N2} ETB");
Console.WriteLine($"{"Bonus",-14}{bonus,12:N2} ETB");
Console.WriteLine($"{"Final credit",-14}{credit,12:N2} ETB");
if (getsExtra)
{
    Console.WriteLine($"(Bonus includes {ExtraBonus:N2} ETB extra for top-ups of {ExtraThreshold:N2} ETB or more.)");
}
