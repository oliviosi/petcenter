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
    public string DominioPersonalizadoStatus { get; set; } = "removed";
    public string? DominioPersonalizadoUltimaFalha { get; set; }
    public bool Publica { get; set; }
}
