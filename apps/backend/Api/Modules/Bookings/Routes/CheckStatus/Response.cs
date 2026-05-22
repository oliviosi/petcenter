namespace Api.Modules.Bookings.Routes.CheckStatus;

public class CheckBookingStatusResponse
{
    public Guid Id { get; set; }
    public Guid PetshopId { get; set; }
    public Guid ProfessionalId { get; set; }
    public Guid ServiceId { get; set; }
    public string State { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime SlotStart { get; set; }
    public DateTime SlotEnd { get; set; }
    public CheckBookingStatusRejectionResponse? Rejection { get; set; }
    public CheckBookingStatusCancellationResponse? Cancellation { get; set; }
    public CheckBookingStatusCompletionResponse? Completion { get; set; }
    public CheckBookingStatusNoShowResponse? NoShow { get; set; }
}

public class CheckBookingStatusRejectionResponse
{
    public DateTime RejectedAt { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class CheckBookingStatusCancellationResponse
{
    public DateTime CancelledAt { get; set; }
}

public class CheckBookingStatusCompletionResponse
{
    public DateTime CompletedAt { get; set; }
}

public class CheckBookingStatusNoShowResponse
{
    public DateTime NoShowAt { get; set; }
}
