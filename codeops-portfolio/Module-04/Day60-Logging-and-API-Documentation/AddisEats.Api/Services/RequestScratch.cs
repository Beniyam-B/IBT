namespace AddisEats.Api.Services;

public class RequestScratch : IRequestScratch
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Path { get; set; } = "";
}
