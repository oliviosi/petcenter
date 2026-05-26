using FluentValidation;

namespace Api.Modules.Bookings.Routes.ListFeedback;

public class ListBookingFeedbackRequestValidator : AbstractValidator<ListBookingFeedbackRequest>
{
    public ListBookingFeedbackRequestValidator()
    {
        RuleFor(x => x.EndDate)
            .Must((request, endDate) => !request.StartDate.HasValue || !endDate.HasValue || endDate.Value >= request.StartDate.Value)
            .WithMessage("Data final deve ser igual ou posterior à data inicial.");
    }
}
