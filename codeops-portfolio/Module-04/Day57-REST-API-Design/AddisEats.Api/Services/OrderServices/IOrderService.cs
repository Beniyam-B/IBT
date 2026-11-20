using AddisEats.Api.Dtos;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services.OrderServices;

public interface IOrderService
{
    Order? GetById(int id);

    // Returns null when the order cannot be placed.
    Order? Place(CreateOrderDto request);

    // The same pattern as TryParse: true when the move was allowed and applied.
    bool TryChangeStatus(Order order, OrderStatus next);
}
