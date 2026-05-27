using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Sockets;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainDnsVerificationService : IStorefrontDomainDnsVerificationService
{
    private readonly StorefrontDomainVerificationOptions _options;

    public StorefrontDomainDnsVerificationService(IOptions<StorefrontDomainVerificationOptions> options) =>
        _options = options.Value;

    public async Task<StorefrontDomainDnsVerificationResult> VerifyAsync(string domain, CancellationToken cancellationToken = default)
    {
        var dominioNormalizado = NormalizeHost(domain);
        var destinoEsperado = NormalizeHost(_options.ExpectedTarget);

        var enderecosDominio = await ResolveAsync(dominioNormalizado, cancellationToken);
        if (enderecosDominio.Count == 0)
        {
            return new StorefrontDomainDnsVerificationResult
            {
                IsVerified = false,
                Message = $"Não foi possível resolver o domínio '{dominioNormalizado}'. Próxima tentativa automática será agendada."
            };
        }

        if (IPAddress.TryParse(destinoEsperado, out var ipDestinoEsperado))
        {
            return new StorefrontDomainDnsVerificationResult
            {
                IsVerified = enderecosDominio.Contains(ipDestinoEsperado),
                Message = enderecosDominio.Contains(ipDestinoEsperado)
                    ? $"Domínio '{dominioNormalizado}' verificado com sucesso."
                    : $"O domínio '{dominioNormalizado}' ainda não aponta para '{destinoEsperado}'."
            };
        }

        var enderecosDestinoEsperado = await ResolveAsync(destinoEsperado, cancellationToken);
        var verificado = enderecosDestinoEsperado.Count > 0
            && enderecosDominio.Overlaps(enderecosDestinoEsperado);

        return new StorefrontDomainDnsVerificationResult
        {
            IsVerified = verificado,
            Message = verificado
                ? $"Domínio '{dominioNormalizado}' verificado com sucesso."
                : $"O domínio '{dominioNormalizado}' ainda não aponta para '{destinoEsperado}'."
        };
    }

    private static async Task<HashSet<IPAddress>> ResolveAsync(string host, CancellationToken cancellationToken)
    {
        try
        {
            var addresses = await Dns.GetHostAddressesAsync(host, cancellationToken);
            return addresses.ToHashSet();
        }
        catch (SocketException)
        {
            return [];
        }
    }

    private static string NormalizeHost(string host) =>
        host.Trim().ToLowerInvariant().TrimEnd('.').Split(':', 2)[0];
}
