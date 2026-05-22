using Api.Exceptions;

namespace Api.Modules.ProfessionalServiceAssignments.Domain;

public class ProfessionalServiceAssignmentNotFoundException : NotFoundException
{
    public ProfessionalServiceAssignmentNotFoundException(Guid professionalId, Guid serviceId)
        : base($"A atribuição entre o profissional '{professionalId}' e o serviço '{serviceId}' não foi encontrada.") { }
}

public class ProfessionalServiceAssignmentConflictException : ConflictException
{
    public ProfessionalServiceAssignmentConflictException(Guid professionalId, Guid serviceId)
        : base($"O profissional '{professionalId}' já está vinculado ao serviço '{serviceId}'.") { }
}

public class ProfessionalServiceAssignmentInactiveException : DomainException
{
    public ProfessionalServiceAssignmentInactiveException(string target)
        : base($"O {target} informado está inativo.") { }
}
