namespace Api.Modules.Servicos.Routes.Update;

public class UpdateServicoRequest
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int DuracaoMinutos { get; set; }
    public decimal PrecoBase { get; set; }
}
