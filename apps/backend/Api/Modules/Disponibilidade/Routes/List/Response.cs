namespace Api.Modules.Disponibilidade.Routes.List;

public class ListDisponibilidadeResponse
{
    public Guid Id { get; set; }
    public Guid ProfissionalId { get; set; }
    public int DiaSemana { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public DateTime CriadoEm { get; set; }
}
