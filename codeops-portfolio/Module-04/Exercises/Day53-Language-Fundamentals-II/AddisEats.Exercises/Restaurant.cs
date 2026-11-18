public class Restaurant
{
    public int Id { get; init; }                 // can only be set when the object is created
    public string Name { get; set; } = "";       // can be changed any time
    public string Area { get; set; } = "";
    public string DisplayName => $"{Name} ({Area})";   // computed on every read, stores nothing
}
