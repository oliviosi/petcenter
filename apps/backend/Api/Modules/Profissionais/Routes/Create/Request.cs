namespace Api.Modules.Profissionais.Routes.Create;

public class CreateProfissionalRequest
{
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
}
