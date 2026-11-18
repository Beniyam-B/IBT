using AddisEats.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AddisEats.Api.Data;

public class AddisEatsContext : DbContext
{
    public AddisEatsContext(DbContextOptions<AddisEatsContext> options) : base(options)
    {
    }

    // One DbSet per table. MenuItems becomes the dbo.MenuItems table.
    public DbSet<MenuItem> MenuItems => Set<MenuItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MenuItem>(entity =>
        {
            entity.Property(m => m.Name).IsRequired().HasMaxLength(100);
            entity.Property(m => m.Category).IsRequired().HasMaxLength(50);
            entity.Property(m => m.PriceEtb).HasPrecision(10, 2);

            // The twelve starting rows, inserted when the database is created.
            entity.HasData(MenuSeed.Items);
        });
    }
}
