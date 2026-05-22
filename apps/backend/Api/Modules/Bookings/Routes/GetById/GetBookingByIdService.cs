using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Bookings.Routes.GetById;

public class GetBookingByIdService : IGetBookingByIdService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IProfissionalRepository _professionalRepository;
    private readonly IServicoRepository _serviceRepository;

    public GetBookingByIdService(
        IBookingRepository bookingRepository,
        IProfissionalRepository professionalRepository,
        IServicoRepository serviceRepository)
    {
        _bookingRepository = bookingRepository;
        _professionalRepository = professionalRepository;
        _serviceRepository = serviceRepository;
    }

    public async Task<GetBookingByIdResponse> HandleAsync(Guid id, Guid empresaId)
    {
        var booking = await _bookingRepository.GetByIdAsync(id)
            ?? throw new BookingNotFoundException(id);

        if (booking.EmpresaId != empresaId)
            throw new BookingForbiddenException();

        var professional = await _professionalRepository.GetByIdAsync(booking.ProfessionalId, empresaId)
            ?? throw new ProfissionalNotFoundException(booking.ProfessionalId);

        var service = await _serviceRepository.GetByIdAsync(booking.ServiceId, empresaId)
            ?? throw new ServicoNotFoundException(booking.ServiceId);

        return new GetBookingByIdResponse
        {
            Id = booking.Id,
            EmpresaId = booking.EmpresaId,
            State = booking.State,
            RequestedAt = booking.RequestedAt,
            ConfirmedAt = booking.ConfirmedAt,
            SlotStart = booking.SlotStart,
            SlotEnd = booking.SlotEnd,
            OwnerContact = booking.OwnerContact,
            Professional = new GetBookingByIdProfessionalResponse
            {
                Id = professional.Id,
                Nome = professional.Nome,
                Especialidade = professional.Especialidade
            },
            Service = new GetBookingByIdServiceResponse
            {
                Id = service.Id,
                Nome = service.Nome,
                DuracaoMinutos = service.DuracaoMinutos,
                PrecoBase = service.PrecoBase
            },
            Pet = new GetBookingByIdPetResponse
            {
                ClientId = booking.ClientId,
                Nome = booking.PetName,
                Especie = booking.PetSpecies
            },
            Rejection = booking.RejectedAt.HasValue && !string.IsNullOrWhiteSpace(booking.RejectionReason)
                ? new GetBookingByIdRejectionResponse
                {
                    RejectedAt = booking.RejectedAt.Value,
                    Reason = booking.RejectionReason
                }
                : null,
            Completion = booking.CompletedAt.HasValue && booking.FinalChargedPrice.HasValue
                ? new GetBookingByIdCompletionResponse
                {
                    CompletedAt = booking.CompletedAt.Value,
                    FinalChargedPrice = booking.FinalChargedPrice.Value
                }
                : null,
            Cancellation = booking.CancelledAt.HasValue && !string.IsNullOrWhiteSpace(booking.CancellationReason)
                ? new GetBookingByIdCancellationResponse
                {
                   CancelledAt = booking.CancelledAt.Value,
                   Reason = booking.CancellationReason
                }
                : null,
            NoShow = booking.NoShowAt.HasValue && !string.IsNullOrWhiteSpace(booking.NoShowReason)
                ? new GetBookingByIdNoShowResponse
                {
                   NoShowAt = booking.NoShowAt.Value,
                   Reason = booking.NoShowReason
                }
                : null
        };
    }
}
