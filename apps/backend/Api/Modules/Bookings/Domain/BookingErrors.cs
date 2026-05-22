using Api.Exceptions;

namespace Api.Modules.Bookings.Domain;

public class BookingNotFoundException : NotFoundException
{
    public BookingNotFoundException(Guid id)
        : base($"Reserva '{id}' não encontrada.") { }
}

public class BookingSlotUnavailableException : DomainException
{
    public BookingSlotUnavailableException()
        : base("O horário informado não está disponível para reserva.") { }
}

public class BookingInactiveProfessionalException : DomainException
{
    public BookingInactiveProfessionalException()
        : base("O profissional informado está inativo.") { }
}

public class BookingInactiveServiceException : DomainException
{
    public BookingInactiveServiceException()
        : base("O serviço informado está inativo.") { }
}

public class BookingInvalidStateTransitionException : DomainException
{
    public BookingInvalidStateTransitionException(string currentState, string targetState)
        : base($"A transição de '{currentState}' para '{targetState}' não é válida.") { }
}

public class PublicSlotsIntervalOutOfRangeException : DomainException
{
    public PublicSlotsIntervalOutOfRangeException(DateOnly maxDate)
        : base($"A consulta de horários só pode ir até {maxDate:yyyy-MM-dd}.") { }
}

public class PublicSlotsIntervalInvalidException : DomainException
{
    public PublicSlotsIntervalInvalidException()
        : base("Informe um intervalo de datas válido a partir da data atual.") { }
}
