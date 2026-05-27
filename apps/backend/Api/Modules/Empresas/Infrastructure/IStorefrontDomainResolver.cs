using System.Net;

namespace Api.Modules.Empresas.Infrastructure;

public interface IStorefrontDomainResolver
{
    Task<HashSet<IPAddress>> ResolveAsync(string host, CancellationToken cancellationToken = default);
}
