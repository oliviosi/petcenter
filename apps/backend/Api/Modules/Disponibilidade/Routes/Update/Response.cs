namespace Api.Modules.Disponibilidade.Routes.Update;

public class UpdateDisponibilidadeResponse
{
    public Guid Id { get; set; }
    public Guid ProfissionalId { get; set; }
    public int DiaSemana { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public DateTime CriadoEm { get; set; }
}
