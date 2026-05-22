namespace Api.Modules.Bookings.Routes.List;

public class ListBookingsResponse
{
    public Guid Id { get; set; }
    public string State { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime SlotStart { get; set; }
    public DateTime SlotEnd { get; set; }
    public string OwnerContact { get; set; } = string.Empty;
    public ListBookingsProfessionalResponse Professional { get; set; } = new();
    public ListBookingsServiceResponse Service { get; set; } = new();
    public ListBookingsPetResponse Pet { get; set; } = new();
    public ListBookingsRejectionResponse? Rejection { get; set; }
    public ListBookingsCompletionResponse? Completion { get; set; }
    public ListBookingsCancellationResponse? Cancellation { get; set; }
    public ListBookingsNoShowResponse? NoShow { get; set; }
}

public class ListBookingsProfessionalResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Especialidade { get; set; }
}

public class ListBookingsServiceResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int DuracaoMinutos { get; set; }
    public decimal PrecoBase { get; set; }
}

public class ListBookingsPetResponse
{
    public string Nome { get; set; } = string.Empty;
    public string Especie { get; set; } = string.Empty;
}

public class ListBookingsRejectionResponse
{
    public DateTime RejectedAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class ListBookingsCompletionResponse
{
    public DateTime CompletedAt { get; set; }
    public decimal FinalChargedPrice { get; set; }
}

public class ListBookingsCancellationResponse
{
    public DateTime CancelledAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class ListBookingsNoShowResponse
{
    public DateTime NoShowAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}
