namespace AddisEats.Catalog;

public class CustomerClass
{
    public string Name { get; }
    public string Phone { get; }

    public CustomerClass(string name, string phone)
    {
        Name = name;
        Phone = phone;
    }
}

