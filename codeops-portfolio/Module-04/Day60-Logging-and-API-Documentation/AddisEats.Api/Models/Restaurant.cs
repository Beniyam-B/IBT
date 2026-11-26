namespace AddisEats.Api.Models;

public class Restaurant
{
    public int Id { get; init; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";     // the area, such as Bole
    public string Phone { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public decimal DeliveryFeeEtb { get; set; }
    public string OwnerAddress { get; set; } = "";   // private: deliberately not in the DTO
}

