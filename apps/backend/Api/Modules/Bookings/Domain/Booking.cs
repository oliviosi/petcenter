namespace Api.Modules.Bookings.Domain;

public class Booking
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid EmpresaId { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public Guid ServiceId { get; private set; }
    public Guid ClientId { get; private set; }
    public string OwnerContact { get; private set; } = string.Empty;
    public string PetName { get; private set; } = string.Empty;
    public string PetSpecies { get; private set; } = string.Empty;
    public DateTime SlotStart { get; private set; }
    public DateTime SlotEnd { get; private set; }
    public string State { get; private set; } = BookingStates.Requested;
    public DateTime RequestedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; private set; }
    public DateTime? RejectedAt { get; private set; }
    public string? RejectionReason { get; private set; }

    private Booking() { }

    public Booking(
        Guid empresaId,
        Guid professionalId,
        Guid serviceId,
        Guid clientId,
        string ownerContact,
        string petName,
        string petSpecies,
        DateTime slotStart,
        DateTime slotEnd)
    {
        if (empresaId == Guid.Empty)
            throw new ArgumentException("Empresa inválida.");
        if (professionalId == Guid.Empty)
            throw new ArgumentException("Profissional inválido.");
        if (serviceId == Guid.Empty)
            throw new ArgumentException("Serviço inválido.");
        if (clientId == Guid.Empty)
            throw new ArgumentException("Cliente inválido.");

        EmpresaId = empresaId;
        ProfessionalId = professionalId;
        ServiceId = serviceId;
        ClientId = clientId;

        DefinirOwnerContact(ownerContact);
        DefinirPetName(petName);
        DefinirPetSpecies(petSpecies);
        DefinirSlot(slotStart, slotEnd);
    }

    public void Confirm(DateTime confirmedAt)
    {
        if (State != BookingStates.Requested)
            throw new BookingInvalidStateTransitionException(State, BookingStates.Confirmed);

        State = BookingStates.Confirmed;
        ConfirmedAt = NormalizeUtc(confirmedAt);
        RejectedAt = null;
        RejectionReason = null;
    }

    public void Reject(string reason, DateTime rejectedAt)
    {
        if (State != BookingStates.Requested)
            throw new BookingInvalidStateTransitionException(State, BookingStates.Rejected);

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Motivo de rejeição é obrigatório.");

        State = BookingStates.Rejected;
        RejectedAt = NormalizeUtc(rejectedAt);
        RejectionReason = reason.Trim();
    }

    private void DefinirOwnerContact(string ownerContact)
    {
        if (string.IsNullOrWhiteSpace(ownerContact))
            throw new ArgumentException("Contato do responsável é obrigatório.");

        OwnerContact = ownerContact.Trim();
    }

    private void DefinirPetName(string petName)
    {
        if (string.IsNullOrWhiteSpace(petName))
            throw new ArgumentException("Nome do pet é obrigatório.");

        PetName = petName.Trim();
    }

    private void DefinirPetSpecies(string petSpecies)
    {
        if (string.IsNullOrWhiteSpace(petSpecies))
            throw new ArgumentException("Espécie do pet é obrigatória.");

        PetSpecies = petSpecies.Trim();
    }

    private void DefinirSlot(DateTime slotStart, DateTime slotEnd)
    {
        var normalizedStart = NormalizeUtc(slotStart);
        var normalizedEnd = NormalizeUtc(slotEnd);

        if (normalizedEnd <= normalizedStart)
            throw new ArgumentException("Horário final deve ser posterior ao inicial.");

        SlotStart = normalizedStart;
        SlotEnd = normalizedEnd;
    }

    private static DateTime NormalizeUtc(DateTime value) =>
        value.Kind == DateTimeKind.Utc
            ? value
            : value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
                : value.ToUniversalTime();
}
