using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Domain;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Bookings.Routes.Create;

public class CreateBookingService : ICreateBookingService
{
    private readonly IEmpresaRepository _empresaRepository;
    private readonly IProfissionalRepository _professionalRepository;
    private readonly IServicoRepository _serviceRepository;
    private readonly IBookingAvailabilityService _availabilityService;
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingEventPublisher _eventPublisher;
    private readonly IBookingStatusAccessTokenService _bookingStatusAccessTokenService;
    private readonly IBookingFeedbackAccessTokenService _feedbackAccessTokenService;

    public CreateBookingService(
        IEmpresaRepository empresaRepository,
        IProfissionalRepository professionalRepository,
        IServicoRepository serviceRepository,
        IBookingAvailabilityService availabilityService,
        IBookingRepository bookingRepository,
        IBookingEventPublisher eventPublisher,
        IBookingStatusAccessTokenService bookingStatusAccessTokenService,
        IBookingFeedbackAccessTokenService feedbackAccessTokenService)
    {
        _empresaRepository = empresaRepository;
        _professionalRepository = professionalRepository;
        _serviceRepository = serviceRepository;
        _availabilityService = availabilityService;
        _bookingRepository = bookingRepository;
        _eventPublisher = eventPublisher;
        _bookingStatusAccessTokenService = bookingStatusAccessTokenService;
        _feedbackAccessTokenService = feedbackAccessTokenService;
    }

    public async Task<CreateBookingResponse> HandleAsync(CreateBookingRequest request)
    {
        var petshop = await _empresaRepository.GetPublicByIdAsync(request.PetshopId)
            ?? throw new EmpresaNotFoundException(request.PetshopId);

        var professional = await _professionalRepository.GetByIdAsync(request.ProfessionalId, petshop.Id)
            ?? throw new ProfissionalNotFoundException(request.ProfessionalId);
        if (!professional.Ativo)
            throw new BookingInactiveProfessionalException();

        var service = await _serviceRepository.GetByIdAsync(request.ServiceId, petshop.Id)
            ?? throw new ServicoNotFoundException(request.ServiceId);
        if (!service.Ativo)
            throw new BookingInactiveServiceException();

        var requestedStart = NormalizeUtc(request.SlotStart);
        var requestedEnd = NormalizeUtc(request.SlotEnd);
        var slotDate = DateOnly.FromDateTime(requestedStart);

        var availableSlots = await _availabilityService.GetAvailableSlotsAsync(new BookingAvailabilityQuery
        {
            PetshopId = petshop.Id,
            ServiceId = service.Id,
            ProfessionalId = professional.Id,
            StartDate = slotDate,
            EndDate = slotDate
        });

        if (!availableSlots.Any(slot => slot.SlotStart == requestedStart && slot.SlotEnd == requestedEnd))
            throw new BookingSlotUnavailableException();

        var bookingStatusAccessToken = _bookingStatusAccessTokenService.GenerateToken();
        var feedbackAccessToken = _feedbackAccessTokenService.GenerateToken();

        var booking = new Booking(
            petshop.Id,
            professional.Id,
            service.Id,
            Guid.NewGuid(),
            request.OwnerContact,
            request.PetName,
            request.PetSpecies,
            _bookingStatusAccessTokenService.ProtectToken(bookingStatusAccessToken),
            _feedbackAccessTokenService.ProtectToken(feedbackAccessToken),
            requestedStart,
            requestedEnd);

        await _bookingRepository.AddAsync(booking);

        await _eventPublisher.PublishRequestedAsync(new BookingRequestedMessage
        {
            BookingId = booking.Id,
            EmpresaId = booking.EmpresaId,
            ProfessionalId = booking.ProfessionalId,
            ServiceId = booking.ServiceId,
            ClientId = booking.ClientId,
            RequestedAt = booking.RequestedAt,
            SlotStart = booking.SlotStart,
            SlotEnd = booking.SlotEnd
        });

        return new CreateBookingResponse
        {
            Id = booking.Id,
            PetshopId = booking.EmpresaId,
            ProfessionalId = booking.ProfessionalId,
            ServiceId = booking.ServiceId,
            ClientId = booking.ClientId,
            State = booking.State,
            OwnerContact = booking.OwnerContact,
            PetName = booking.PetName,
            PetSpecies = booking.PetSpecies,
            BookingStatusAccessToken = bookingStatusAccessToken,
            FeedbackAccessToken = feedbackAccessToken,
            RequestedAt = booking.RequestedAt,
            SlotStart = booking.SlotStart,
            SlotEnd = booking.SlotEnd
        };
    }

    private static DateTime NormalizeUtc(DateTime value) =>
        value.Kind == DateTimeKind.Utc
            ? value
            : value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
                : value.ToUniversalTime();
}
