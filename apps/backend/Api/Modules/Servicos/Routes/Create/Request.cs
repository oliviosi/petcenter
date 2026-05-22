namespace Api.Modules.Servicos.Routes.Create;

public class CreateServicoRequest
{
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int DuracaoMinutos { get; set; }
    public decimal PrecoBase { get; set; }
}
