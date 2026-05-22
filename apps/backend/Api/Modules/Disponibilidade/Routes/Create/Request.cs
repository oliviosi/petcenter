namespace Api.Modules.Disponibilidade.Routes.Create;

public class CreateDisponibilidadeRequest
{
    public Guid ProfissionalId { get; set; }
    public Guid EmpresaId { get; set; }
    public int DiaSemana { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
}
