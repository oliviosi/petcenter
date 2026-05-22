using Api.Modules.Bookings.Domain;
using FluentValidation;

namespace Api.Modules.Bookings.Routes.List;

public class ListBookingsRequestValidator : AbstractValidator<ListBookingsRequest>
{
    private static readonly string[] ValidStates =
    [
        BookingStates.Requested,
        BookingStates.Confirmed,
        BookingStates.Rejected,
        BookingStates.Completed
    ];

    public ListBookingsRequestValidator()
    {
        RuleFor(x => x.EmpresaId)
            .NotEmpty().WithMessage("Empresa é obrigatória.");

        RuleFor(x => x.State)
            .Must(state => state is null || ValidStates.Contains(state.Trim().ToLowerInvariant()))
            .WithMessage("Estado da reserva inválido.");

        RuleFor(x => x.EndDate)
            .Must((request, endDate) => !request.StartDate.HasValue || !endDate.HasValue || endDate.Value >= request.StartDate.Value)
            .WithMessage("Data final deve ser igual ou posterior à data inicial.");
    }
}
