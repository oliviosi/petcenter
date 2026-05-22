namespace Api.Modules.Disponibilidade.Domain;

public class DisponibilidadeProfissional
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid ProfissionalId { get; private set; }
    public DayOfWeek DiaSemana { get; private set; }
    public TimeOnly HoraInicio { get; private set; }
    public TimeOnly HoraFim { get; private set; }
    public DateTime CriadoEm { get; private set; } = DateTime.UtcNow;

    private DisponibilidadeProfissional() { }

    public DisponibilidadeProfissional(Guid profissionalId, DayOfWeek diaSemana, TimeOnly horaInicio, TimeOnly horaFim)
    {
        ProfissionalId = profissionalId;
        DefinirJanela(diaSemana, horaInicio, horaFim);
    }

    public void DefinirJanela(DayOfWeek diaSemana, TimeOnly horaInicio, TimeOnly horaFim)
    {
        if (horaFim <= horaInicio)
            throw new ArgumentException("Hora de fim deve ser posterior à hora de início.");
        DiaSemana = diaSemana;
        HoraInicio = horaInicio;
        HoraFim = horaFim;
    }
}
