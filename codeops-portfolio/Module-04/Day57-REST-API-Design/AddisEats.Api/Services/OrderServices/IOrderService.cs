using AddisEats.Api.Dtos;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services.OrderServices;

public interface IOrderService
{
    Order? GetById(int id);

    PlaceOrderResult Place(CreateOrderDto request);

    // The same pattern as TryParse: true when the move was allowed and applied.
    bool TryChangeStatus(Order order, OrderStatus next);

    CancelOutcome Cancel(int id);
}
