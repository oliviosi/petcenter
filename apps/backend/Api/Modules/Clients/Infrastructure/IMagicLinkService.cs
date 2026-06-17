namespace Api.Modules.Clients.Infrastructure;

public interface IMagicLinkService
{
    // Generate a short-lived magic token for the given owner contact (email) and optional context
    Task<string> GenerateAsync(string ownerContact, TimeSpan? ttl = null);

    // Consume (validate and remove) the magic token. Returns owner contact if valid, otherwise null
    Task<string?> ConsumeAsync(string token);
}
