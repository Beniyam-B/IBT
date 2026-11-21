using System.ComponentModel.DataAnnotations;
using AddisEats.Api.Models;

namespace AddisEats.Api.Dtos;

public class UpdateOrderStatusDto
{
    [EnumDataType(typeof(OrderStatus), ErrorMessage = "Status must be one of Placed, Preparing, OnTheWay, Delivered or Cancelled.")]
    public OrderStatus Status { get; set; }
}
