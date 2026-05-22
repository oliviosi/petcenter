using FluentValidation;

namespace Api.Modules.Bookings.Routes.GetSlots;

public class GetPublicSlotsRequestValidator : AbstractValidator<GetPublicSlotsRequest>
{
    public GetPublicSlotsRequestValidator()
    {
        RuleFor(x => x.PetshopId)
            .NotEmpty().WithMessage("Petshop é obrigatório.");

        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage("Serviço é obrigatório.");

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate!.Value)
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue)
            .WithMessage("Data final deve ser igual ou posterior à data inicial.");
    }
}
