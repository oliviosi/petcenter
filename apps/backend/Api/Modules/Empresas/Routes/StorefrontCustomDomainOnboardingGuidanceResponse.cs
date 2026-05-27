namespace Api.Modules.Empresas.Routes;

public class StorefrontCustomDomainOnboardingGuidanceResponse
{
    public string Modo { get; set; } = "none";
    public string TipoRegistro { get; set; } = "none";
    public string NomeRegistro { get; set; } = string.Empty;
    public string ZonaDns { get; set; } = string.Empty;
    public string[] ValoresEsperados { get; set; } = [];
    public string[] HostnamesEsperados { get; set; } = [];
    public string[] IpsEsperados { get; set; } = [];
    public string InstrucaoPrimaria { get; set; } = string.Empty;
    public string? InstrucaoSecundaria { get; set; }
    public string? OrientacaoRedirecionamentoWwwOpcional { get; set; }
}
