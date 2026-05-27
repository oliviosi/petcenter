namespace Api.Modules.Empresas.Infrastructure;

public interface IStorefrontDomainVerificationService
{
    Task ProcessPendingAsync(CancellationToken cancellationToken = default);
}
