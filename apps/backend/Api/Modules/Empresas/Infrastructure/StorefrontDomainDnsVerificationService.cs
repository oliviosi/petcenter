using Microsoft.Extensions.Options;
using System.Net;
using Api.Modules.Empresas.Domain;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainDnsVerificationService : IStorefrontDomainDnsVerificationService
{
    private readonly IStorefrontDomainResolver _resolver;
    private readonly StorefrontDomainVerificationOptions _options;

    public StorefrontDomainDnsVerificationService(
        IStorefrontDomainResolver resolver,
        IOptions<StorefrontDomainVerificationOptions> options)
    {
        _resolver = resolver;
        _options = options.Value;
    }

    public async Task<StorefrontDomainDnsVerificationResult> VerifyAsync(string domain, CancellationToken cancellationToken = default)
    {
        var dominioNormalizado = NormalizeHost(domain);
        var analysis = StorefrontCustomDomainAnalysis.Create(dominioNormalizado);

        var enderecosDominio = await _resolver.ResolveAsync(dominioNormalizado, cancellationToken);
        if (enderecosDominio.Count == 0)
        {
            return new StorefrontDomainDnsVerificationResult
            {
                IsVerified = false,
                Message = $"Não foi possível resolver o domínio '{dominioNormalizado}'. Próxima tentativa automática será agendada."
            };
        }

        return analysis.Mode == StorefrontCustomDomainMode.Apex
            ? await VerifyApexAsync(dominioNormalizado, enderecosDominio, cancellationToken)
            : await VerifySubdomainAsync(dominioNormalizado, enderecosDominio, cancellationToken);
    }

    private async Task<StorefrontDomainDnsVerificationResult> VerifySubdomainAsync(
        string domain,
        HashSet<IPAddress> resolvedAddresses,
        CancellationToken cancellationToken)
    {
        var expectedTarget = NormalizeExpectedTarget(_options.ExpectedTarget);
        if (IPAddress.TryParse(expectedTarget, out var expectedIpAddress))
        {
            return new StorefrontDomainDnsVerificationResult
            {
                IsVerified = resolvedAddresses.Contains(expectedIpAddress),
                Message = resolvedAddresses.Contains(expectedIpAddress)
                    ? $"Domínio '{domain}' verificado com sucesso."
                    : $"O domínio '{domain}' ainda não aponta para '{expectedTarget}'."
            };
        }

        var expectedTargetAddresses = await _resolver.ResolveAsync(expectedTarget, cancellationToken);
        var isVerified = expectedTargetAddresses.Count > 0
            && resolvedAddresses.Overlaps(expectedTargetAddresses);

        return new StorefrontDomainDnsVerificationResult
        {
            IsVerified = isVerified,
            Message = isVerified
                ? $"Domínio '{domain}' verificado com sucesso."
                : $"O domínio '{domain}' ainda não aponta para '{expectedTarget}'."
        };
    }

    private async Task<StorefrontDomainDnsVerificationResult> VerifyApexAsync(
        string domain,
        HashSet<IPAddress> resolvedAddresses,
        CancellationToken cancellationToken)
    {
        var supportedAddresses = new HashSet<IPAddress>();

        foreach (var apexTarget in _options.ApexExpectedTargets.Select(NormalizeExpectedTarget))
        {
            if (string.IsNullOrWhiteSpace(apexTarget))
                continue;

            if (IPAddress.TryParse(apexTarget, out var apexIpAddress))
            {
                supportedAddresses.Add(apexIpAddress);
                continue;
            }

            var targetAddresses = await _resolver.ResolveAsync(apexTarget, cancellationToken);
            supportedAddresses.UnionWith(targetAddresses);
        }

        var isVerified = supportedAddresses.Count > 0
            && resolvedAddresses.Overlaps(supportedAddresses);

        if (isVerified)
        {
            return new StorefrontDomainDnsVerificationResult
            {
                IsVerified = true,
                Message = $"Domínio '{domain}' verificado com sucesso."
            };
        }

        return new StorefrontDomainDnsVerificationResult
        {
            IsVerified = false,
            Message = $"O domínio raiz '{domain}' ainda não resolve para um destino apex suportado."
        };
    }

    private static string NormalizeHost(string host) =>
        host.Trim().ToLowerInvariant().TrimEnd('.');

    private static string NormalizeExpectedTarget(string target)
    {
        var normalizedTarget = target.Trim().TrimEnd('.');
        if (IPAddress.TryParse(normalizedTarget, out var ipAddress))
            return ipAddress.ToString();

        return normalizedTarget.ToLowerInvariant();
    }
}
