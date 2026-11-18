namespace AddisEats.Menu;

// A record: a type that is just data. Equality, printing and "with" copies come free.
public record MenuItem(int Id, string Name, string Category, decimal Price);
