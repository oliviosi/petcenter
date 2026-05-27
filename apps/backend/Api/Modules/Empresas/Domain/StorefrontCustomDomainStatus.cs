namespace Api.Modules.Empresas.Domain;

public enum StorefrontCustomDomainStatus
{
    Removed = 0,
    PendingSetup = 1,
    Verifying = 2,
    ProvisioningTls = 3,
    Active = 4,
    Failed = 5,
    TlsFailed = 6
}
