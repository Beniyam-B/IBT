namespace AddisEats.Api.Errors;

public record ApiError(string Code, int Status, string Title);
