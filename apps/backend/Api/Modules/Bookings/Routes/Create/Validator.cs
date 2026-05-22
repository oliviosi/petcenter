using FluentValidation;

namespace Api.Modules.Bookings.Routes.Create;

public class CreateBookingRequestValidator : AbstractValidator<CreateBookingRequest>
{
    public CreateBookingRequestValidator()
    {
        RuleFor(x => x.PetshopId)
            .NotEmpty().WithMessage("Petshop é obrigatório.");

        RuleFor(x => x.ProfessionalId)
            .NotEmpty().WithMessage("Profissional é obrigatório.");

        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage("Serviço é obrigatório.");

        RuleFor(x => x.OwnerContact)
            .NotEmpty().WithMessage("Contato do responsável é obrigatório.")
            .MaximumLength(200).WithMessage("Contato do responsável deve ter no máximo 200 caracteres.");

        RuleFor(x => x.PetName)
            .NotEmpty().WithMessage("Nome do pet é obrigatório.")
            .MaximumLength(120).WithMessage("Nome do pet deve ter no máximo 120 caracteres.");

        RuleFor(x => x.PetSpecies)
            .NotEmpty().WithMessage("Espécie do pet é obrigatória.")
            .MaximumLength(120).WithMessage("Espécie do pet deve ter no máximo 120 caracteres.");

        RuleFor(x => x.SlotEnd)
            .GreaterThan(x => x.SlotStart)
            .WithMessage("Horário final deve ser posterior ao inicial.");
    }
}
