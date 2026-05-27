namespace Api.Modules.Empresas.Infrastructure;

public interface IStorefrontDomainCertificateReadinessService
{
    Task<StorefrontDomainCertificateReadinessResult> CheckAsync(
        string domain,
        CancellationToken cancellationToken = default);
}
