using AddisEats.Api.DTOs;
using AddisEats.Api.Common;
using AddisEats.Api.Models;

namespace AddisEats.Api.Services.OrderServices;

public interface IOrderService
{
    Result<Order> GetById(int id);

    Result<Order> Place(CreateOrderDto request);

    // Moves an order forward only. Cancelling is Cancel.
    Result<Order> ChangeStatus(int id, OrderStatus next);

    Result<Order> Cancel(int id);
}

