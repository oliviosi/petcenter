using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;

namespace Api.Modules.Empresas.Routes.GetPublicProfile;

public class GetEmpresaPublicProfileService : IGetEmpresaPublicProfileService
{
    private readonly IEmpresaRepository _repo;

    public GetEmpresaPublicProfileService(IEmpresaRepository repo) => _repo = repo;

    public async Task<GetEmpresaPublicProfileResponse> HandleAsync(Guid empresaId)
    {
        var empresa = await _repo.GetByIdAsync(empresaId)
            ?? throw new EmpresaNotFoundException(empresaId);

        return new GetEmpresaPublicProfileResponse
        {
            Id = empresa.Id,
            Nome = empresa.Nome,
            Slug = empresa.Slug,
            Descricao = empresa.Descricao,
            Cidade = empresa.Cidade,
            Bairro = empresa.Bairro,
            ResumoContato = empresa.ResumoContato,
            ResumoEndereco = empresa.ResumoEndereco,
            DominioPersonalizadoDesejado = empresa.DominioPersonalizadoDesejado,
            DominioPersonalizadoAtivo = empresa.DominioPersonalizadoAtivo,
            DominioPersonalizadoStatus = ToApiStatus(empresa.DominioPersonalizadoStatus),
            DominioPersonalizadoUltimaFalha = empresa.DominioPersonalizadoUltimaFalha,
            DominioPersonalizadoUltimaTentativaEm = empresa.DominioPersonalizadoUltimaTentativaEm,
            DominioPersonalizadoProximaTentativaEm = empresa.DominioPersonalizadoProximaTentativaEm,
            DominioPersonalizadoVerificadoEm = empresa.DominioPersonalizadoVerificadoEm,
            DominioPersonalizadoDnsStatus = ToApiDnsStatus(empresa.DominioPersonalizadoDnsStatus),
            DominioPersonalizadoDnsUltimaFalha = empresa.DominioPersonalizadoUltimaFalha,
            DominioPersonalizadoDnsUltimaTentativaEm = empresa.DominioPersonalizadoUltimaTentativaEm,
            DominioPersonalizadoDnsProximaTentativaEm = empresa.DominioPersonalizadoProximaTentativaEm,
            DominioPersonalizadoDnsVerificadoEm = empresa.DominioPersonalizadoVerificadoEm,
            DominioPersonalizadoTlsStatus = ToApiTlsStatus(empresa.DominioPersonalizadoTlsStatus),
            DominioPersonalizadoTlsUltimaFalha = empresa.DominioPersonalizadoTlsUltimaFalha,
            DominioPersonalizadoTlsProvisionamentoIniciadoEm = empresa.DominioPersonalizadoTlsProvisionamentoIniciadoEm,
            DominioPersonalizadoTlsUltimaTentativaEm = empresa.DominioPersonalizadoTlsUltimaTentativaEm,
            DominioPersonalizadoTlsProximaTentativaEm = empresa.DominioPersonalizadoTlsProximaTentativaEm,
            DominioPersonalizadoHttpsProntoEm = empresa.DominioPersonalizadoHttpsProntoEm,
            DominioPersonalizadoAtivadoEm = empresa.DominioPersonalizadoAtivadoEm,
            Publica = empresa.Publica
        };
    }

    private static string ToApiStatus(StorefrontCustomDomainStatus status) => status switch
    {
        StorefrontCustomDomainStatus.PendingSetup => "pending_setup",
        StorefrontCustomDomainStatus.Verifying => "verifying_dns",
        StorefrontCustomDomainStatus.ProvisioningTls => "provisioning_tls",
        StorefrontCustomDomainStatus.Active => "active",
        StorefrontCustomDomainStatus.Failed => "dns_failed",
        StorefrontCustomDomainStatus.TlsFailed => "tls_failed",
        _ => "removed"
    };

    private static string ToApiDnsStatus(StorefrontCustomDomainDnsStatus status) => status switch
    {
        StorefrontCustomDomainDnsStatus.PendingSetup => "pending_setup",
        StorefrontCustomDomainDnsStatus.Verifying => "verifying",
        StorefrontCustomDomainDnsStatus.Verified => "verified",
        StorefrontCustomDomainDnsStatus.Failed => "failed",
        _ => "removed"
    };

    private static string ToApiTlsStatus(StorefrontCustomDomainTlsStatus status) => status switch
    {
        StorefrontCustomDomainTlsStatus.Provisioning => "provisioning",
        StorefrontCustomDomainTlsStatus.Ready => "ready",
        StorefrontCustomDomainTlsStatus.Failed => "failed",
        _ => "not_started"
    };
}
