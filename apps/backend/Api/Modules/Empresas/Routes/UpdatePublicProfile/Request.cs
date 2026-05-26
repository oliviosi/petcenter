namespace Api.Modules.Empresas.Routes.UpdatePublicProfile;

public class UpdateEmpresaPublicProfileRequest
{
    public Guid EmpresaId { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string ResumoContato { get; set; } = string.Empty;
    public string ResumoEndereco { get; set; } = string.Empty;
    public string DominioPersonalizadoDesejado { get; set; } = string.Empty;
    public bool Publica { get; set; }
}
