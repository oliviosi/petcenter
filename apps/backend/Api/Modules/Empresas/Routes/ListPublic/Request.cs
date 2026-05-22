namespace Api.Modules.Empresas.Routes.ListPublic;

public class ListPublicEmpresasRequest
{
    public string? Nome { get; set; }
    public string? Cidade { get; set; }
    public string? Bairro { get; set; }
    public string? Servico { get; set; }
    public decimal? MinRating { get; set; }
    public string? OrderBy { get; set; }
    public string? OrderDirection { get; set; }
}
