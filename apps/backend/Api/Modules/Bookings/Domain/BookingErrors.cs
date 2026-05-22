using Api.Exceptions;

namespace Api.Modules.Bookings.Domain;

public class BookingNotFoundException : NotFoundException
{
    public BookingNotFoundException(Guid id)
        : base($"Reserva '{id}' não encontrada.") { }
}

public class BookingForbiddenException : ForbiddenException
{
    public BookingForbiddenException()
        : base("Acesso à reserva não permitido.") { }
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

public class BookingInvalidFinalChargedPriceException : DomainException
{
    public BookingInvalidFinalChargedPriceException()
        : base("Preço final deve ser maior ou igual a zero.") { }
}

public class BookingFeedbackTokenInvalidException : UnauthorizedException
{
    public BookingFeedbackTokenInvalidException()
        : base("Token de feedback inválido.") { }
}

public class BookingStatusTokenInvalidException : UnauthorizedException
{
    public BookingStatusTokenInvalidException()
        : base("Token de status inválido.") { }
}

public class BookingFeedbackAlreadySubmittedException : ConflictException
{
    public BookingFeedbackAlreadySubmittedException(Guid bookingId)
        : base($"Feedback já enviado para a reserva '{bookingId}'.") { }
}

public class BookingFeedbackNotEligibleException : DomainException
{
    public BookingFeedbackNotEligibleException()
        : base("A reserva informada ainda não está elegível para feedback.") { }
}

public class BookingFeedbackRatingOutOfRangeException : DomainException
{
    public BookingFeedbackRatingOutOfRangeException()
        : base("As notas devem estar entre 1 e 5.") { }
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
