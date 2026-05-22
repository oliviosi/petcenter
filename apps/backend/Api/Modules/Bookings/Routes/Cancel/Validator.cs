using FluentValidation;

namespace Api.Modules.Bookings.Routes.Cancel;

public class CancelBookingRequestValidator : AbstractValidator<CancelBookingRequest>
{
    public CancelBookingRequestValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("Reserva é obrigatória.");

        RuleFor(x => x.EmpresaId)
            .NotEmpty().WithMessage("Empresa é obrigatória.");

        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("Motivo do cancelamento é obrigatório.")
            .MaximumLength(500).WithMessage("Motivo do cancelamento deve ter no máximo 500 caracteres.");
    }
}
