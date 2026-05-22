namespace Api.Modules.Profissionais.Routes.List;

public class ListProfissionaisResponse
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
}
