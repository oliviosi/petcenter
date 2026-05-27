using Api.Modules.Empresas.Infrastructure;
using Microsoft.Extensions.Options;
using System.Net;

namespace Api.Tests.Empresas;

public class StorefrontDomainDnsVerificationServiceTests
{
    [Fact]
    public async Task VerifyAsync_ShouldAcceptApexDomainWhenResolvedOutcomeMatchesSupportedTargets()
    {
        var sut = new StorefrontDomainDnsVerificationService(
            new FakeStorefrontDomainResolver(new Dictionary<string, HashSet<IPAddress>>(StringComparer.OrdinalIgnoreCase)
            {
                ["petcenter.com.br"] = [IPAddress.Parse("198.51.100.10")],
                ["apex.storefront.petcenter.local"] = [IPAddress.Parse("198.51.100.10")]
            }),
            Options.Create(new StorefrontDomainVerificationOptions
            {
                ExpectedTarget = "storefront.petcenter.local",
                ApexExpectedTargets = ["198.51.100.10", "apex.storefront.petcenter.local"]
            }));

        var result = await sut.VerifyAsync("petcenter.com.br");

        Assert.True(result.IsVerified);
        Assert.Equal("Domínio 'petcenter.com.br' verificado com sucesso.", result.Message);
    }

    [Fact]
    public async Task VerifyAsync_ShouldRejectApexDomainWhenResolvedOutcomeDoesNotMatchSupportedTargets()
    {
        var sut = new StorefrontDomainDnsVerificationService(
            new FakeStorefrontDomainResolver(new Dictionary<string, HashSet<IPAddress>>(StringComparer.OrdinalIgnoreCase)
            {
                ["petcenter.com.br"] = [IPAddress.Parse("198.51.100.20")],
                ["apex.storefront.petcenter.local"] = [IPAddress.Parse("198.51.100.10")]
            }),
            Options.Create(new StorefrontDomainVerificationOptions
            {
                ExpectedTarget = "storefront.petcenter.local",
                ApexExpectedTargets = ["198.51.100.10", "apex.storefront.petcenter.local"]
            }));

        var result = await sut.VerifyAsync("petcenter.com.br");

        Assert.False(result.IsVerified);
        Assert.Equal("O domínio raiz 'petcenter.com.br' ainda não resolve para um destino apex suportado.", result.Message);
    }
}

internal class FakeStorefrontDomainResolver : IStorefrontDomainResolver
{
    private readonly Dictionary<string, HashSet<IPAddress>> _records;

    public FakeStorefrontDomainResolver(Dictionary<string, HashSet<IPAddress>> records) => _records = records;

    public Task<HashSet<IPAddress>> ResolveAsync(string host, CancellationToken cancellationToken = default)
    {
        var normalizedHost = host.Trim().ToLowerInvariant().TrimEnd('.');
        return Task.FromResult(_records.TryGetValue(normalizedHost, out var addresses)
            ? addresses
            : new HashSet<IPAddress>());
    }
}
