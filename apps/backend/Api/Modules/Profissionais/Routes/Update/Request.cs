namespace Api.Modules.Profissionais.Routes.Update;

public class UpdateProfissionalRequest
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
}
