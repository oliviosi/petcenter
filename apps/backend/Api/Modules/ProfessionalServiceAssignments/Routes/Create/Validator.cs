using FluentValidation;

namespace Api.Modules.ProfessionalServiceAssignments.Routes.Create;

public class CreateProfessionalServiceAssignmentRequestValidator : AbstractValidator<CreateProfessionalServiceAssignmentRequest>
{
    public CreateProfessionalServiceAssignmentRequestValidator()
    {
        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Profissional é obrigatório.");

        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage("Serviço é obrigatório.");
    }
}
