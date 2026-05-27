namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainCertificateReadinessResult
{
    public bool IsReady { get; set; }
    public string Message { get; set; } = string.Empty;
}
