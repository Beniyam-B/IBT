using AddisEats.Api.Models;

namespace AddisEats.Api.Data;

// Sample data. We have no database yet, so this list is the menu.
public static class SeedData
{
    public static List<MenuItem> MenuItems { get; } = new()
    {
        new MenuItem { Id = 1,  Name = "Doro Wat",  Category = "Mains",     PriceEtb = 320m },
        new MenuItem { Id = 2,  Name = "Kitfo",     Category = "Mains",     PriceEtb = 380m },
        new MenuItem { Id = 3,  Name = "Tibs",      Category = "Mains",     PriceEtb = 290m },
        new MenuItem { Id = 4,  Name = "Shiro",     Category = "Mains",     PriceEtb = 180m },
        new MenuItem { Id = 5,  Name = "Beyaynetu", Category = "Mains",     PriceEtb = 240m },
        new MenuItem { Id = 6,  Name = "Firfir",    Category = "Breakfast", PriceEtb = 150m },
        new MenuItem { Id = 7,  Name = "Chechebsa", Category = "Breakfast", PriceEtb = 130m },
        new MenuItem { Id = 8,  Name = "Ful",       Category = "Breakfast", PriceEtb = 110m },
        new MenuItem { Id = 9,  Name = "Sambusa",   Category = "Snacks",    PriceEtb = 40m },
        new MenuItem { Id = 10, Name = "Kolo",      Category = "Snacks",    PriceEtb = 60m },
        new MenuItem { Id = 11, Name = "Buna",      Category = "Drinks",    PriceEtb = 45m },
        new MenuItem { Id = 12, Name = "Tej",       Category = "Drinks",    PriceEtb = 120m }
    };
}
