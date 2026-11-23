namespace AddisEats.Api.Errors;

// A service says "this can fail" in its signature. The failure carries a catalogue entry and a detail message.
public class Result<T>
{
    public T? Value { get; init; }
    public ApiError? Error { get; init; }
    public string? Detail { get; init; }
    public bool IsSuccess => Error is null;

    public static Result<T> Ok(T value) => new() { Value = value };

    public static Result<T> Fail(ApiError error, string detail) => new() { Error = error, Detail = detail };
}
