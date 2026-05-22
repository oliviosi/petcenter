namespace Api.Modules.Bookings.Routes.GetById;

public class GetBookingByIdResponse
{
    public Guid Id { get; set; }
    public Guid EmpresaId { get; set; }
    public string State { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime SlotStart { get; set; }
    public DateTime SlotEnd { get; set; }
    public string OwnerContact { get; set; } = string.Empty;
    public GetBookingByIdProfessionalResponse Professional { get; set; } = new();
    public GetBookingByIdServiceResponse Service { get; set; } = new();
    public GetBookingByIdPetResponse Pet { get; set; } = new();
    public GetBookingByIdRejectionResponse? Rejection { get; set; }
    public GetBookingByIdCompletionResponse? Completion { get; set; }
    public GetBookingByIdCancellationResponse? Cancellation { get; set; }
    public GetBookingByIdNoShowResponse? NoShow { get; set; }
}

public class GetBookingByIdProfessionalResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
}

public class GetBookingByIdServiceResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int DuracaoMinutos { get; set; }
    public decimal PrecoBase { get; set; }
}

public class GetBookingByIdPetResponse
{
    public Guid ClientId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Especie { get; set; } = string.Empty;
}

public class GetBookingByIdRejectionResponse
{
    public DateTime RejectedAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class GetBookingByIdCompletionResponse
{
    public DateTime CompletedAt { get; set; }
    public decimal FinalChargedPrice { get; set; }
}

public class GetBookingByIdCancellationResponse
{
    public DateTime CancelledAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class GetBookingByIdNoShowResponse
{
    public DateTime NoShowAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}
