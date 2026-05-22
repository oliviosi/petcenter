using FluentValidation;

namespace Api.Modules.Bookings.Routes.SubmitFeedback;

public class SubmitBookingFeedbackRequestValidator : AbstractValidator<SubmitBookingFeedbackRequest>
{
    public SubmitBookingFeedbackRequestValidator()
    {
        RuleFor(x => x.BookingId)
            .NotEmpty().WithMessage("Reserva é obrigatória.");

        RuleFor(x => x.FeedbackAccessToken)
            .NotEmpty().WithMessage("Token de feedback é obrigatório.")
            .MaximumLength(200).WithMessage("Token de feedback deve ter no máximo 200 caracteres.");

        RuleFor(x => x.ProfessionalRating)
            .InclusiveBetween(1, 5).WithMessage("Nota do profissional deve estar entre 1 e 5.");

        RuleFor(x => x.PetshopRating)
            .InclusiveBetween(1, 5).WithMessage("Nota do petshop deve estar entre 1 e 5.");

        RuleFor(x => x.Comment)
            .MaximumLength(1000).WithMessage("Comentário deve ter no máximo 1000 caracteres.")
            .When(x => x.Comment is not null);
    }
}
