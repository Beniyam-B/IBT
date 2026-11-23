namespace AddisEats.Api.Errors;

// The error catalogue from the README, in code. The code is for machines, the title for people.
public static class ErrorCatalogue
{
    public static readonly ApiError ValidationFailed     = new("VALIDATION_FAILED", 400, "One or more validation errors occurred.");
    public static readonly ApiError InvalidPaging        = new("INVALID_PAGING", 400, "The page or limit is out of range.");
    public static readonly ApiError UnknownParameter     = new("UNKNOWN_PARAMETER", 400, "The request has a query parameter this endpoint does not accept.");
    public static readonly ApiError RestaurantNotFound   = new("RESTAURANT_NOT_FOUND", 404, "The restaurant was not found.");
    public static readonly ApiError MenuItemNotFound     = new("MENU_ITEM_NOT_FOUND", 404, "The menu item was not found.");
    public static readonly ApiError OrderNotFound        = new("ORDER_NOT_FOUND", 404, "The order was not found.");
    public static readonly ApiError RestaurantClosed     = new("RESTAURANT_CLOSED", 409, "This restaurant is closed.");
    public static readonly ApiError OrderStatusConflict  = new("ORDER_STATUS_CONFLICT", 409, "The order cannot make that move.");
    public static readonly ApiError OrderAlreadyDelivered = new("ORDER_ALREADY_DELIVERED", 409, "This order cannot be cancelled.");
    public static readonly ApiError AmountInvalid        = new("AMOUNT_INVALID", 422, "The order total is below the minimum order.");
    public static readonly ApiError ItemNotOnMenu        = new("ITEM_NOT_ON_MENU", 422, "That item is not on this restaurant's menu.");
    public static readonly ApiError InternalError        = new("INTERNAL_ERROR", 500, "Something went wrong on our side.");
}

