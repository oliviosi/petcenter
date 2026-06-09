using Api.Modules.Empresas.Routes;

namespace Api.Modules.Empresas.Routes.GetPublicProfile;

public class GetEmpresaPublicProfileResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Descricao { get; set; }
    public string? Cidade { get; set; }
    public string? Bairro { get; set; }
    public string? ResumoContato { get; set; }
    public string? ResumoEndereco { get; set; }
    public string? DominioPersonalizadoDesejado { get; set; }
    public string? DominioPersonalizadoAtivo { get; set; }
    public string DominioPersonalizadoModo { get; set; } = "none";
    public StorefrontCustomDomainOnboardingGuidanceResponse DominioPersonalizadoOrientacaoDns { get; set; } = new();
    public string DominioPersonalizadoStatus { get; set; } = "removed";
    public string? DominioPersonalizadoUltimaFalha { get; set; }
    public DateTime? DominioPersonalizadoUltimaTentativaEm { get; set; }
    public DateTime? DominioPersonalizadoProximaTentativaEm { get; set; }
    public DateTime? DominioPersonalizadoVerificadoEm { get; set; }
    public string DominioPersonalizadoDnsStatus { get; set; } = "removed";
    public string? DominioPersonalizadoDnsUltimaFalha { get; set; }
    public DateTime? DominioPersonalizadoDnsUltimaTentativaEm { get; set; }
    public DateTime? DominioPersonalizadoDnsProximaTentativaEm { get; set; }
    public DateTime? DominioPersonalizadoDnsVerificadoEm { get; set; }
    public string DominioPersonalizadoTlsStatus { get; set; } = "not_started";
    public string? DominioPersonalizadoTlsUltimaFalha { get; set; }
    public DateTime? DominioPersonalizadoTlsProvisionamentoIniciadoEm { get; set; }
    public DateTime? DominioPersonalizadoTlsUltimaTentativaEm { get; set; }
    public DateTime? DominioPersonalizadoTlsProximaTentativaEm { get; set; }
    public DateTime? DominioPersonalizadoHttpsProntoEm { get; set; }
    public DateTime? DominioPersonalizadoAtivadoEm { get; set; }
    public DateTime? DominioPersonalizadoUltimoMonitoramentoSaudavelEm { get; set; }
    public DateTime? DominioPersonalizadoUltimoMonitoramentoDegradadoEm { get; set; }
    public string? DominioPersonalizadoUltimoMonitoramentoDegradadoMotivo { get; set; }
    public bool DominioPersonalizadoCanonicoRevertidoParaFallback { get; set; }
    public string? DominioPersonalizadoUltimaNotificacaoCategoria { get; set; }
    public string? DominioPersonalizadoUltimaNotificacaoMotivo { get; set; }
    public DateTime? DominioPersonalizadoUltimaNotificacaoEnviadaEm { get; set; }
    public string? DominioPersonalizadoUltimaNotificacaoResultado { get; set; }
    public int DominioPersonalizadoUltimaNotificacaoTentativas { get; set; }
    public bool Publica { get; set; }
}
