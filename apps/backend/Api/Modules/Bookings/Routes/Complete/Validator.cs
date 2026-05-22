using FluentValidation;

namespace Api.Modules.Bookings.Routes.Complete;

public class CompleteBookingRequestValidator : AbstractValidator<CompleteBookingRequest>
{
    public CompleteBookingRequestValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("Reserva é obrigatória.");

        RuleFor(x => x.EmpresaId)
            .NotEmpty().WithMessage("Empresa é obrigatória.");

        RuleFor(x => x.FinalChargedPrice)
            .NotNull().WithMessage("Preço final é obrigatório.")
            .GreaterThanOrEqualTo(0).WithMessage("Preço final deve ser maior ou igual a zero.")
            .Must(value => value is null || decimal.Round(value.Value, 2) == value.Value)
            .WithMessage("Preço final deve ter no máximo 2 casas decimais.");
    }
}
