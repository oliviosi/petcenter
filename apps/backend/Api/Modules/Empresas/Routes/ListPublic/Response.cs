namespace Api.Modules.Empresas.Routes.ListPublic;

public class ListPublicEmpresasResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public string Cidade { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string ResumoContato { get; set; } = string.Empty;
    public string ResumoEndereco { get; set; } = string.Empty;
    public decimal? AverageRating { get; set; }
    public int? FeedbackCount { get; set; }
}
