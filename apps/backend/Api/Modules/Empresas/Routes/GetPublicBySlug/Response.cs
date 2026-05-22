namespace Api.Modules.Empresas.Routes.GetPublicBySlug;

public class GetPublicEmpresaBySlugResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string ResumoContato { get; set; } = string.Empty;
    public string ResumoEndereco { get; set; } = string.Empty;
    public List<GetPublicEmpresaProfissionalResponse> Profissionais { get; set; } = [];
    public List<GetPublicEmpresaServicoResponse> Servicos { get; set; } = [];
}

public class GetPublicEmpresaProfissionalResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
}

public class GetPublicEmpresaServicoResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int DuracaoMinutos { get; set; }
    public decimal PrecoBase { get; set; }
}
