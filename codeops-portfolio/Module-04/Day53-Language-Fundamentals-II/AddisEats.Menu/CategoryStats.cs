namespace AddisEats.Menu;

// What MenuService.StatsFor returns. Data going out, so a record again.
public record CategoryStats(int Count, decimal Total, decimal Average);
