using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;

namespace Api.Modules.Empresas.Routes.UpdatePublicProfile;

public class UpdateEmpresaPublicProfileService : IUpdateEmpresaPublicProfileService
{
    private readonly IEmpresaRepository _repo;
    private readonly TimeProvider _timeProvider;

    public UpdateEmpresaPublicProfileService(IEmpresaRepository repo, TimeProvider timeProvider)
    {
        _repo = repo;
        _timeProvider = timeProvider;
    }

    public async Task<UpdateEmpresaPublicProfileResponse> HandleAsync(UpdateEmpresaPublicProfileRequest request)
    {
        var empresa = await _repo.GetByIdAsync(request.EmpresaId)
            ?? throw new EmpresaNotFoundException(request.EmpresaId);

        empresa.DefinirSlug(request.Slug);
        empresa.DefinirDescricao(request.Descricao);
        empresa.DefinirCidade(request.Cidade);
        empresa.DefinirBairro(request.Bairro);
        empresa.DefinirResumoContato(request.ResumoContato);
        empresa.DefinirResumoEndereco(request.ResumoEndereco);
        empresa.DefinirDominioPersonalizadoDesejado(
            request.DominioPersonalizadoDesejado,
            _timeProvider.GetUtcNow().UtcDateTime);

        if (!string.IsNullOrWhiteSpace(empresa.Slug))
        {
            var empresaComMesmoSlug = await _repo.GetBySlugAsync(empresa.Slug);
            if (empresaComMesmoSlug is not null && empresaComMesmoSlug.Id != empresa.Id)
                throw new EmpresaSlugConflictException(empresa.Slug);
        }

        if (!string.IsNullOrWhiteSpace(empresa.DominioPersonalizadoDesejado))
        {
            var empresaComMesmoDominio = await _repo.GetByCustomDomainAsync(empresa.DominioPersonalizadoDesejado);
            if (empresaComMesmoDominio is not null && empresaComMesmoDominio.Id != empresa.Id)
                throw new EmpresaCustomDomainConflictException(empresa.DominioPersonalizadoDesejado);
        }

        if (request.Publica)
            empresa.PublicarNoCatalogo();
        else
            empresa.OcultarDoCatalogo();

        await _repo.UpdateAsync(empresa);

        return new UpdateEmpresaPublicProfileResponse
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
