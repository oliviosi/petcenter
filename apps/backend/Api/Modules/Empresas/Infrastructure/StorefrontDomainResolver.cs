using System.Net;
using System.Net.Sockets;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainResolver : IStorefrontDomainResolver
{
    public async Task<HashSet<IPAddress>> ResolveAsync(string host, CancellationToken cancellationToken = default)
    {
        try
        {
            var addresses = await Dns.GetHostAddressesAsync(host, cancellationToken);
            return addresses.ToHashSet();
        }
        catch (SocketException)
        {
                    return new HashSet<IPAddress>();
        }
    }
}
