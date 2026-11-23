namespace AddisEats.Api.Dtos;

// The one envelope every collection endpoint returns.
public record PagedResponse<T>(IReadOnlyList<T> Data, int Page, int PageSize, int Total);
