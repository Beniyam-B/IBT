namespace AddisEats.Api.Services.OrderServices;

public enum CancelOutcome
{
    Cancelled,
    NotFound,
    AlreadyDelivered,
    NotCancellable
}
