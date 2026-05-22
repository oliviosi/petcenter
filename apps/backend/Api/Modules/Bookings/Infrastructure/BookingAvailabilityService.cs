using Api.Modules.Disponibilidade.Infrastructure;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.ProfessionalServiceAssignments.Infrastructure;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Servicos.Infrastructure;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingAvailabilityService : IBookingAvailabilityService
{
    private readonly IEmpresaRepository _empresaRepository;
    private readonly IProfissionalRepository _professionalRepository;
    private readonly IServicoRepository _serviceRepository;
    private readonly IProfessionalServiceAssignmentRepository _assignmentRepository;
    private readonly IDisponibilidadeRepository _availabilityRepository;
    private readonly IBookingRepository _bookingRepository;

    public BookingAvailabilityService(
        IEmpresaRepository empresaRepository,
        IProfissionalRepository professionalRepository,
        IServicoRepository serviceRepository,
        IProfessionalServiceAssignmentRepository assignmentRepository,
        IDisponibilidadeRepository availabilityRepository,
        IBookingRepository bookingRepository)
    {
        _empresaRepository = empresaRepository;
        _professionalRepository = professionalRepository;
        _serviceRepository = serviceRepository;
        _assignmentRepository = assignmentRepository;
        _availabilityRepository = availabilityRepository;
        _bookingRepository = bookingRepository;
    }

    public async Task<List<AvailableSlot>> GetAvailableSlotsAsync(BookingAvailabilityQuery query)
    {
        var petshop = await _empresaRepository.GetPublicByIdAsync(query.PetshopId)
            ?? throw new EmpresaNotFoundException(query.PetshopId);

        var service = await _serviceRepository.GetByIdAsync(query.ServiceId, petshop.Id);
        if (service is null || !service.Ativo)
            return [];

        if (query.ProfessionalId.HasValue)
        {
            var professional = await _professionalRepository.GetByIdAsync(query.ProfessionalId.Value, petshop.Id);
            if (professional is null || !professional.Ativo)
                return [];
        }

        var assignments = await _assignmentRepository.ListByServiceAsync(
            petshop.Id,
            query.ServiceId,
            query.ProfessionalId);

        if (assignments.Count == 0)
            return [];

        var activeProfessionals = await _professionalRepository.ListAtivosByEmpresaAsync(petshop.Id);
        var activeProfessionalIds = activeProfessionals.Select(p => p.Id).ToHashSet();
        var professionalIds = assignments
            .Select(a => a.ProfessionalId)
            .Where(activeProfessionalIds.Contains)
            .Distinct()
            .ToArray();

        if (professionalIds.Length == 0)
            return [];

        var availabilities = await _availabilityRepository.ListByProfissionaisAsync(professionalIds);
        if (availabilities.Count == 0)
            return [];

        var intervalStart = ToUtc(query.StartDate, TimeOnly.MinValue);
        var intervalEndExclusive = ToUtc(query.EndDate.AddDays(1), TimeOnly.MinValue);
        var confirmedBookings = await _bookingRepository.ListConfirmedOverlappingAsync(
            petshop.Id,
            professionalIds,
            intervalStart,
            intervalEndExclusive);

        var confirmedByProfessional = confirmedBookings
            .GroupBy(b => b.ProfessionalId)
            .ToDictionary(g => g.Key, g => g.OrderBy(b => b.SlotStart).ToList());

        var availabilitiesByProfessional = availabilities
            .GroupBy(a => a.ProfissionalId)
            .ToDictionary(g => g.Key, g => g.OrderBy(a => a.DiaSemana).ThenBy(a => a.HoraInicio).ToList());

        var duration = TimeSpan.FromMinutes(service.DuracaoMinutos);
        var slots = new List<AvailableSlot>();

        foreach (var professionalId in professionalIds)
        {
            if (!availabilitiesByProfessional.TryGetValue(professionalId, out var professionalAvailabilities))
                continue;

            var professionalBookings = confirmedByProfessional.GetValueOrDefault(professionalId, []);

            for (var date = query.StartDate; date <= query.EndDate; date = date.AddDays(1))
            {
                var dayAvailabilities = professionalAvailabilities
                    .Where(a => a.DiaSemana == date.DayOfWeek)
                    .ToList();

                foreach (var availability in dayAvailabilities)
                {
                    var slotStart = ToUtc(date, availability.HoraInicio);
                    var windowEnd = ToUtc(date, availability.HoraFim);

                    while (slotStart.Add(duration) <= windowEnd)
                    {
                        var slotEnd = slotStart.Add(duration);
                        if (!professionalBookings.Any(b => b.SlotStart < slotEnd && b.SlotEnd > slotStart))
                        {
                            slots.Add(new AvailableSlot
                            {
                                PetshopId = petshop.Id,
                                ProfessionalId = professionalId,
                                ServiceId = service.Id,
                                SlotStart = slotStart,
                                SlotEnd = slotEnd
                            });
                        }

                        slotStart = slotStart.Add(duration);
                    }
                }
            }
        }

        return slots
            .OrderBy(s => s.SlotStart)
            .ThenBy(s => s.ProfessionalId)
            .ToList();
    }

    private static DateTime ToUtc(DateOnly date, TimeOnly time) =>
        DateTime.SpecifyKind(date.ToDateTime(time), DateTimeKind.Utc);
}
