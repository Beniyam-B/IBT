using AddisEats.Api.Dtos;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services.OrderServices;

public interface IOrderService
{
    Order? GetById(int id);

    // Returns null when the order cannot be placed.
    Order? Place(CreateOrderDto request);
}
