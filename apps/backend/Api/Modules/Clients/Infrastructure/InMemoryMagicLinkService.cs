using System.Collections.Concurrent;

namespace Api.Modules.Clients.Infrastructure;

public class InMemoryMagicLinkService : IMagicLinkService
{
    private readonly ConcurrentDictionary<string, (string ownerContact, DateTime expiresAt)> _store = new();
    private readonly TimeSpan _defaultTtl = TimeSpan.FromMinutes(10);

    public Task<string> GenerateAsync(string ownerContact, TimeSpan? ttl = null)
    {
        var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).TrimEnd('=')
            .Replace('+', '-').Replace('/', '_');
        var expiration = DateTime.UtcNow.Add(ttl ?? _defaultTtl);
        _store[token] = (ownerContact, expiration);
        return Task.FromResult(token);
    }

    public Task<string?> ConsumeAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token)) return Task.FromResult<string?>(null);

        if (_store.TryGetValue(token, out var entry))
        {
            if (entry.expiresAt < DateTime.UtcNow)
            {
                _store.TryRemove(token, out _);
                return Task.FromResult<string?>(null);
            }

            _store.TryRemove(token, out _);
            return Task.FromResult<string?>(entry.ownerContact);
        }

        return Task.FromResult<string?>(null);
    }
}
