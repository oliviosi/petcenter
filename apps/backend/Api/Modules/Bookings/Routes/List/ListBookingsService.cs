using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Bookings.Routes.List;

public class ListBookingsService : IListBookingsService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IProfissionalRepository _professionalRepository;
    private readonly IServicoRepository _serviceRepository;

    public ListBookingsService(
        IBookingRepository bookingRepository,
        IProfissionalRepository professionalRepository,
        IServicoRepository serviceRepository)
    {
        _bookingRepository = bookingRepository;
        _professionalRepository = professionalRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task<List<ListBookingsResponse>> HandleAsync(ListBookingsRequest request)
    {
        var normalizedState = string.IsNullOrWhiteSpace(request.State)
            ? null
            : request.State.Trim().ToLowerInvariant();

        var slotStartFrom = request.StartDate.HasValue
            ? (DateTime?)ToUtc(request.StartDate.Value)
            : null;

        var slotStartToExclusive = request.EndDate.HasValue
            ? (DateTime?)ToUtc(request.EndDate.Value.AddDays(1))
            : null;

        var bookings = await _bookingRepository.ListByEmpresaAsync(
            request.EmpresaId,
            slotStartFrom,
            slotStartToExclusive,
            normalizedState,
            request.ProfessionalId);

        var professionals = await _professionalRepository.ListByIdsAsync(
            request.EmpresaId,
            bookings.Select(b => b.ProfessionalId));

        var services = await _serviceRepository.ListByIdsAsync(
            request.EmpresaId,
            bookings.Select(b => b.ServiceId));

        var professionalsById = professionals.ToDictionary(p => p.Id);
        var servicesById = services.ToDictionary(s => s.Id);

        return bookings.Select(booking =>
        {
            var professional = professionalsById[booking.ProfessionalId];
            var service = servicesById[booking.ServiceId];

            return new ListBookingsResponse
            {
                Id = booking.Id,
                State = booking.State,
                RequestedAt = booking.RequestedAt,
                ConfirmedAt = booking.ConfirmedAt,
                SlotStart = booking.SlotStart,
                SlotEnd = booking.SlotEnd,
                OwnerContact = booking.OwnerContact,
                Professional = new ListBookingsProfessionalResponse
                {
                    Id = professional.Id,
                    Nome = professional.Nome,
                    Especialidade = professional.Especialidade
                },
                Service = new ListBookingsServiceResponse
                {
                    Id = service.Id,
                    Nome = service.Nome,
                    DuracaoMinutos = service.DuracaoMinutos,
                    PrecoBase = service.PrecoBase
                },
                Pet = new ListBookingsPetResponse
                {
                    Nome = booking.PetName,
                    Especie = booking.PetSpecies
                },
                Rejection = booking.RejectedAt.HasValue && !string.IsNullOrWhiteSpace(booking.RejectionReason)
                    ? new ListBookingsRejectionResponse
                    {
                        RejectedAt = booking.RejectedAt.Value,
                        Reason = booking.RejectionReason
                    }
                    : null,
                Completion = booking.CompletedAt.HasValue && booking.FinalChargedPrice.HasValue
                    ? new ListBookingsCompletionResponse
                    {
                        CompletedAt = booking.CompletedAt.Value,
                        FinalChargedPrice = booking.FinalChargedPrice.Value
                    }
                    : null
            };
        }).ToList();
    }

    private static DateTime ToUtc(DateOnly date) =>
        DateTime.SpecifyKind(date.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);
}
