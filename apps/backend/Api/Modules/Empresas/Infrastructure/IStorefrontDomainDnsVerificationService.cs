namespace Api.Modules.Empresas.Infrastructure;

public interface IStorefrontDomainDnsVerificationService
{
    Task<StorefrontDomainDnsVerificationResult> VerifyAsync(string domain, CancellationToken cancellationToken = default);
}
