using AddisEats.Api.Models;

namespace AddisEats.Api.Services.OrderServices;

public enum PlaceOrderOutcome
{
    Placed,
    AmountInvalid,
    RestaurantNotFound,
    RestaurantClosed,
    MenuItemNotFound,
    ItemNotOnMenu
}

// The service says WHAT happened. The controller decides how HTTP describes it.
public record PlaceOrderResult(PlaceOrderOutcome Outcome, Order? Order = null);
