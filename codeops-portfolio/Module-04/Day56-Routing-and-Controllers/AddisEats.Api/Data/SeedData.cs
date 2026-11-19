using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

// Sample data. We have no database yet, so these lists are the data.
public static class SeedData
{
    // Four areas, uneven counts: Bole 9, Megenagna 10, Mexico 7, Ayat 6.
    public static List<Restaurant> Restaurants { get; } = new()
    {
        R(1,  "Addis Ababa Restaurant",     "Bole",      "0911001234", true,  "kebele 05, House 123"),
        R(2,  "Blue Nile Restaurant",       "Ayat",      "0911005678", false, "Kebele 10, House 200"),
        R(3,  "Lucy Restaurant",            "Mexico",    "0911009012", true,  "Kebele 02, House 77"),
        R(4,  "Ethio Restaurant",           "Megenagna", "0911003456", true,  "Kebele 04, House 150"),
        R(5,  "Tena Yistilign Restaurant",  "Bole",      "0911007890", true,  "Kebele 08, House 352"),
        R(6,  "Kategna Restaurant",         "Megenagna", "0911002345", true,  "Kebele 05, House 207"),
        R(7,  "Sishu Restaurant",           "Bole",      "0911006789", false, "Kebele 01, House 88"),
        R(8,  "Abay Restaurant",            "Megenagna", "0911000123", true,  "Kebele 06, House 144"),
        R(9,  "Fendika Restaurant",         "Mexico",    "0911004567", false, "Kebele 07, House 64"),
        R(10, "Doro Wat Restaurant",        "Megenagna", "0911008901", true,  "Kebele 03, House 410"),
        R(11, "Injera Restaurant",          "Mexico",    "0911002346", true,  "Kebele 02, House 77"),
        R(12, "Bunna Restaurant",           "Ayat",      "0911006780", true,  "Kebele 12, House 27"),

        R(13, "Habesha Kitfo House",        "Bole",      "0911001301", true,  "Kebele 03, House 112"),
        R(14, "Selam Shiro Corner",         "Megenagna", "0911001402", true,  "Kebele 05, House 48"),
        R(15, "Gojo Tibs",                  "Mexico",    "0911001503", true,  "Kebele 02, House 77"),
        R(16, "Tizita Restaurant",          "Ayat",      "0911001604", true,  "Kebele 11, House 305"),
        R(17, "Meskel Square Grill",        "Mexico",    "0911001705", true,  "Kebele 07, House 19"),
        R(18, "Enat Injera",                "Bole",      "0911001806", false, "Kebele 09, House 230"),
        R(19, "Buna Bet",                   "Megenagna", "0911001907", true,  "Kebele 04, House 61"),
        R(20, "Wollo Firfir House",         "Megenagna", "0911002008", true,  "Kebele 06, House 144"),
        R(21, "Gursha Kitchen",             "Bole",      "0911002109", true,  "Kebele 01, House 88"),
        R(22, "Mesob Restaurant",           "Ayat",      "0911002210", true,  "Kebele 12, House 27"),
        R(23, "Lalibela Table",             "Bole",      "0911002311", true,  "Kebele 08, House 352"),
        R(24, "Aksum Bites",                "Mexico",    "0911002412", false, "Kebele 10, House 96"),
        R(25, "Tana Fish House",            "Megenagna", "0911002513", true,  "Kebele 03, House 410"),
        R(26, "Entoto View Cafe",           "Ayat",      "0911002614", true,  "Kebele 13, House 53"),
        R(27, "Awash Grill",                "Bole",      "0911002715", true,  "Kebele 02, House 129"),
        R(28, "Dire Dawa Corner",           "Megenagna", "0911002816", true,  "Kebele 05, House 207"),
        R(29, "Harar Gate Restaurant",      "Mexico",    "0911002917", true,  "Kebele 07, House 64"),
        R(30, "Shewa Bet",                  "Bole",      "0911003018", true,  "Kebele 09, House 183"),
        R(31, "Genet Doro Wat",             "Megenagna", "0911003119", false, "Kebele 04, House 36"),
        R(32, "Abeba Restaurant",           "Ayat",      "0911003220", true,  "Kebele 11, House 271")
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
        ("Tej",       "Drinks",    120m),
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
