using FluentValidation;

namespace Api.Modules.Bookings.Routes.NoShow;

public class NoShowBookingRequestValidator : AbstractValidator<NoShowBookingRequest>
{
    public NoShowBookingRequestValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("Reserva é obrigatória.");

        RuleFor(x => x.EmpresaId)
            .NotEmpty().WithMessage("Empresa é obrigatória.");

        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("Motivo do não comparecimento é obrigatório.")
            .MaximumLength(500).WithMessage("Motivo do não comparecimento deve ter no máximo 500 caracteres.");
    }
}
