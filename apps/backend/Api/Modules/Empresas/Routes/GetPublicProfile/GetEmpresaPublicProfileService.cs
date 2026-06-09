using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Microsoft.Extensions.Options;

namespace Api.Modules.Empresas.Routes.GetPublicProfile;

public class GetEmpresaPublicProfileService : IGetEmpresaPublicProfileService
{
    private readonly IEmpresaRepository _repo;
    private readonly StorefrontDomainVerificationOptions _domainVerificationOptions;

    public GetEmpresaPublicProfileService(
        IEmpresaRepository repo,
        IOptions<StorefrontDomainVerificationOptions> domainVerificationOptions)
    {
        _repo = repo;
        _domainVerificationOptions = domainVerificationOptions.Value;
    }

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
            DominioPersonalizadoModo = StorefrontCustomDomainApiMapper.ToApiMode(empresa.ObterModoDominioPersonalizadoDesejado()),
            DominioPersonalizadoOrientacaoDns = StorefrontCustomDomainApiMapper.BuildOnboardingGuidance(
                empresa.DominioPersonalizadoDesejado,
                _domainVerificationOptions),
            DominioPersonalizadoStatus = StorefrontCustomDomainApiMapper.ToApiStatus(empresa.DominioPersonalizadoStatus),
            DominioPersonalizadoUltimaFalha = empresa.DominioPersonalizadoUltimaFalha,
            DominioPersonalizadoUltimaTentativaEm = empresa.DominioPersonalizadoUltimaTentativaEm,
            DominioPersonalizadoProximaTentativaEm = empresa.DominioPersonalizadoProximaTentativaEm,
            DominioPersonalizadoVerificadoEm = empresa.DominioPersonalizadoVerificadoEm,
            DominioPersonalizadoDnsStatus = StorefrontCustomDomainApiMapper.ToApiDnsStatus(empresa.DominioPersonalizadoDnsStatus),
            DominioPersonalizadoDnsUltimaFalha = empresa.DominioPersonalizadoUltimaFalha,
            DominioPersonalizadoDnsUltimaTentativaEm = empresa.DominioPersonalizadoUltimaTentativaEm,
            DominioPersonalizadoDnsProximaTentativaEm = empresa.DominioPersonalizadoProximaTentativaEm,
            DominioPersonalizadoDnsVerificadoEm = empresa.DominioPersonalizadoVerificadoEm,
            DominioPersonalizadoTlsStatus = StorefrontCustomDomainApiMapper.ToApiTlsStatus(empresa.DominioPersonalizadoTlsStatus),
            DominioPersonalizadoTlsUltimaFalha = empresa.DominioPersonalizadoTlsUltimaFalha,
            DominioPersonalizadoTlsProvisionamentoIniciadoEm = empresa.DominioPersonalizadoTlsProvisionamentoIniciadoEm,
            DominioPersonalizadoTlsUltimaTentativaEm = empresa.DominioPersonalizadoTlsUltimaTentativaEm,
            DominioPersonalizadoTlsProximaTentativaEm = empresa.DominioPersonalizadoTlsProximaTentativaEm,
            DominioPersonalizadoHttpsProntoEm = empresa.DominioPersonalizadoHttpsProntoEm,
            DominioPersonalizadoAtivadoEm = empresa.DominioPersonalizadoAtivadoEm,
            DominioPersonalizadoUltimoMonitoramentoSaudavelEm = empresa.DominioPersonalizadoUltimoMonitoramentoSaudavelEm,
            DominioPersonalizadoUltimoMonitoramentoDegradadoEm = empresa.DominioPersonalizadoUltimoMonitoramentoDegradadoEm,
            DominioPersonalizadoUltimoMonitoramentoDegradadoMotivo = empresa.DominioPersonalizadoUltimoMonitoramentoDegradadoMotivo,
            DominioPersonalizadoCanonicoRevertidoParaFallback = empresa.DominioPersonalizadoCanonicoRevertidoParaFallback,
            DominioPersonalizadoUltimaNotificacaoCategoria = empresa.DominioPersonalizadoUltimaNotificacaoCategoria,
            DominioPersonalizadoUltimaNotificacaoMotivo = empresa.DominioPersonalizadoUltimaNotificacaoMotivo,
            DominioPersonalizadoUltimaNotificacaoEnviadaEm = empresa.DominioPersonalizadoUltimaNotificacaoEnviadaEm,
            DominioPersonalizadoUltimaNotificacaoResultado = empresa.DominioPersonalizadoUltimaNotificacaoResultado,
            DominioPersonalizadoUltimaNotificacaoTentativas = empresa.DominioPersonalizadoUltimaNotificacaoTentativas,
            Publica = empresa.Publica
        };
    }
}
