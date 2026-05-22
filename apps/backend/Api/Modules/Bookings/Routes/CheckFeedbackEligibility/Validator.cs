using FluentValidation;

namespace Api.Modules.Bookings.Routes.CheckFeedbackEligibility;

public class CheckBookingFeedbackEligibilityRequestValidator : AbstractValidator<CheckBookingFeedbackEligibilityRequest>
{
    public CheckBookingFeedbackEligibilityRequestValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("Reserva é obrigatória.");

        RuleFor(x => x.FeedbackAccessToken)
            .NotEmpty().WithMessage("Token de feedback é obrigatório.")
            .MaximumLength(200).WithMessage("Token de feedback deve ter no máximo 200 caracteres.");
    }
}
