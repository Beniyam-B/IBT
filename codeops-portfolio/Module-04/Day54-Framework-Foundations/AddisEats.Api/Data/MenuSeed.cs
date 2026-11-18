using AddisEats.Api.Entities;

namespace AddisEats.Api.Data;

// Twelve menu items across four categories. The in-memory service and the database both start from this list.
public static class MenuSeed
{
    public static IReadOnlyList<MenuItem> Items { get; } = new List<MenuItem>
    {
        new() { Id = 1,  Name = "Doro Wat",   Category = "Mains",     PriceEtb = 320m },
        new() { Id = 2,  Name = "Kitfo",      Category = "Mains",     PriceEtb = 380m },
        new() { Id = 3,  Name = "Tibs",       Category = "Mains",     PriceEtb = 290m },
        new() { Id = 4,  Name = "Shiro",      Category = "Mains",     PriceEtb = 180m },
        new() { Id = 5,  Name = "Beyaynetu",  Category = "Mains",     PriceEtb = 240m },
        new() { Id = 6,  Name = "Firfir",     Category = "Breakfast", PriceEtb = 150m },
        new() { Id = 7,  Name = "Chechebsa",  Category = "Breakfast", PriceEtb = 130m },
        new() { Id = 8,  Name = "Ful",        Category = "Breakfast", PriceEtb = 110m },
        new() { Id = 9,  Name = "Sambusa",    Category = "Snacks",    PriceEtb = 40m },
        new() { Id = 10, Name = "Kolo",       Category = "Snacks",    PriceEtb = 60m },
        new() { Id = 11, Name = "Buna",       Category = "Drinks",    PriceEtb = 45m },
        new() { Id = 12, Name = "Tej",        Category = "Drinks",    PriceEtb = 120m },
    };
}
