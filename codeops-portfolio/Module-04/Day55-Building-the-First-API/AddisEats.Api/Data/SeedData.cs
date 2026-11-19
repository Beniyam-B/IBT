using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

// Sample data. We have no database yet, so these lists are the data.
public static class SeedData
{
    // Four areas, uneven counts: Bole 9, Megenagna 10, Mexico 7, Ayat 6.
    public static List<Restaurant> Restaurants { get; } = new()
    {
        R(1,  "Addis Ababa Restaurant",     "Bole",      "555-1234", true,  "456 Elm St"),
        R(2,  "Blue Nile Restaurant",       "Ayat",      "555-5678", false, "789 Pine St"),
        R(3,  "Lucy Restaurant",            "Mexico",    "555-9012", true,  "321 Cedar St"),
        R(4,  "Ethio Restaurant",           "Megenagna", "555-3456", true,  "654 Spruce St"),
        R(5,  "Tena Yistilign Restaurant",  "Bole",      "555-7890", true,  "987 Birch St"),
        R(6,  "Kategna Restaurant",         "Megenagna", "555-2345", true,  "123 Main St"),
        R(7,  "Sishu Restaurant",           "Bole",      "555-6789", false, "246 Aspen St"),
        R(8,  "Abay Restaurant",            "Megenagna", "555-0123", true,  "357 Cherry St"),
        R(9,  "Fendika Restaurant",         "Mexico",    "555-4567", false, "468 Walnut St"),
        R(10, "Doro Wat Restaurant",        "Megenagna", "555-8901", true,  "579 Chestnut St"),
        R(11, "Injera Restaurant",          "Mexico",    "555-2346", true,  "680 Poplar St"),
        R(12, "Bunna Restaurant",           "Ayat",      "555-6780", true,  "791 Fir St"),

        R(13, "Habesha Kitfo House",        "Bole",      "555-1301", true,  "Kebele 03, House 112"),
        R(14, "Selam Shiro Corner",         "Megenagna", "555-1402", true,  "Kebele 05, House 48"),
        R(15, "Gojo Tibs",                  "Mexico",    "555-1503", true,  "Kebele 02, House 77"),
        R(16, "Tizita Restaurant",          "Ayat",      "555-1604", true,  "Kebele 11, House 305"),
        R(17, "Meskel Square Grill",        "Mexico",    "555-1705", true,  "Kebele 07, House 19"),
        R(18, "Enat Injera",                "Bole",      "555-1806", false, "Kebele 09, House 230"),
        R(19, "Buna Bet",                   "Megenagna", "555-1907", true,  "Kebele 04, House 61"),
        R(20, "Wollo Firfir House",         "Megenagna", "555-2008", true,  "Kebele 06, House 144"),
        R(21, "Gursha Kitchen",             "Bole",      "555-2109", true,  "Kebele 01, House 88"),
        R(22, "Mesob Restaurant",           "Ayat",      "555-2210", true,  "Kebele 12, House 27"),
        R(23, "Lalibela Table",             "Bole",      "555-2311", true,  "Kebele 08, House 352"),
        R(24, "Aksum Bites",                "Mexico",    "555-2412", false, "Kebele 10, House 96"),
        R(25, "Tana Fish House",            "Megenagna", "555-2513", true,  "Kebele 03, House 410"),
        R(26, "Entoto View Cafe",           "Ayat",      "555-2614", true,  "Kebele 13, House 53"),
        R(27, "Awash Grill",                "Bole",      "555-2715", true,  "Kebele 02, House 129"),
        R(28, "Dire Dawa Corner",           "Megenagna", "555-2816", true,  "Kebele 05, House 207"),
        R(29, "Harar Gate Restaurant",      "Mexico",    "555-2917", true,  "Kebele 07, House 64"),
        R(30, "Shewa Bet",                  "Bole",      "555-3018", true,  "Kebele 09, House 183"),
        R(31, "Genet Doro Wat",             "Megenagna", "555-3119", false, "Kebele 04, House 36"),
        R(32, "Abeba Restaurant",           "Ayat",      "555-3220", true,  "Kebele 11, House 271")
    };

    // The twelve dishes every restaurant picks from.
    private static readonly (string Name, string Category, decimal Price)[] Dishes =
    {
        ("Doro Wat",  "Mains",     320m),
        ("Kitfo",     "Mains",     380m),
        ("Tibs",      "Mains",     290m),
        ("Shiro",     "Mains",     180m),
        ("Beyaynetu", "Mains",     240m),
        ("Firfir",    "Breakfast", 150m),
        ("Chechebsa", "Breakfast", 130m),
        ("Ful",       "Breakfast", 110m),
        ("Sambusa",   "Snacks",     40m),
        ("Kolo",      "Snacks",     60m),
        ("Buna",      "Drinks",     45m),
        ("Tej",       "Drinks",    120m)
    };

    // Six menu items for every restaurant (192 in total). Each restaurant gets a different mix of dishes
    // and a slightly different price, so the data looks real.
    public static List<MenuItem> MenuItems { get; } = BuildMenu();

    private static List<MenuItem> BuildMenu() =>
        Restaurants
            .SelectMany(r => Enumerable.Range(0, 6).Select(k =>
            {
                var dish = Dishes[(5 * (r.Id + k)) % Dishes.Length];

                return new MenuItem
                {
                    RestaurantId = r.Id,
                    Name = dish.Name,
                    Category = dish.Category,
                    PriceEtb = dish.Price + (r.Id % 4) * 10m
                };
            }))
            .Select((item, index) =>
            {
                item.Id = index + 1;
                return item;
            })
            .ToList();

    private static Restaurant R(int id, string name, string address, string phone, bool isActive, string ownerAddress) =>
        new()
        {
            Id = id,
            Name = name,
            Address = address,
            Phone = phone,
            IsActive = isActive,
            OwnerAddress = ownerAddress
        };
}
