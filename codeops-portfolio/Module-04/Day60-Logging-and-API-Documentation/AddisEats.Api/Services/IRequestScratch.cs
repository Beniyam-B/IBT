namespace AddisEats.Api.Services;

// A scoped service: ASP.NET builds one per request. It remembers which path the current request asked for.
public interface IRequestScratch
{
    Guid Id { get; }
    string Path { get; set; }
}

