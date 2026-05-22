namespace Api.Modules.Profissionais.Routes.Update;

public class UpdateProfissionalResponse
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
    public bool Ativo { get; set; }
    public DateTime CriadoEm { get; set; }
}
