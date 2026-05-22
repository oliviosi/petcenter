namespace Api.Modules.ProfessionalServiceAssignments.Domain;

public class ProfessionalServiceAssignment
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid EmpresaId { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public Guid ServiceId { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private ProfessionalServiceAssignment() { }

    public ProfessionalServiceAssignment(Guid empresaId, Guid professionalId, Guid serviceId)
    {
        if (empresaId == Guid.Empty)
            throw new ArgumentException("Empresa inválida.");
        if (professionalId == Guid.Empty)
            throw new ArgumentException("Profissional inválido.");
        if (serviceId == Guid.Empty)
            throw new ArgumentException("Serviço inválido.");

        EmpresaId = empresaId;
        ProfessionalId = professionalId;
        ServiceId = serviceId;
    }
}
