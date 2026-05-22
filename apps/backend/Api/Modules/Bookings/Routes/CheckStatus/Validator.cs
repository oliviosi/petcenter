using FluentValidation;

namespace Api.Modules.Bookings.Routes.CheckStatus;

public class CheckBookingStatusRequestValidator : AbstractValidator<CheckBookingStatusRequest>
{
    public CheckBookingStatusRequestValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("Reserva é obrigatória.");

        RuleFor(x => x.StatusAccessToken)
            .NotEmpty().WithMessage("Token de status é obrigatório.")
            .MaximumLength(200).WithMessage("Token de status deve ter no máximo 200 caracteres.");
    }
}
