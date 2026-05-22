using System.Text.Json.Serialization;

namespace Api.Modules.Bookings.Infrastructure;

public static class BookingEventNames
{
    public const string Requested = "booking.requested";
    public const string Confirmed = "booking.confirmed";
    public const string Rejected = "booking.rejected";
}

public class BookingRequestedMessage
{
    [JsonPropertyName("bookingId")]
    public Guid BookingId { get; set; }

    [JsonPropertyName("empresaId")]
    public Guid EmpresaId { get; set; }

    [JsonPropertyName("professionalId")]
    public Guid ProfessionalId { get; set; }

    [JsonPropertyName("serviceId")]
    public Guid ServiceId { get; set; }

    [JsonPropertyName("clientId")]
    public Guid ClientId { get; set; }

    [JsonPropertyName("requestedAt")]
    public DateTime RequestedAt { get; set; }

    [JsonPropertyName("slotStart")]
    public DateTime SlotStart { get; set; }

    [JsonPropertyName("slotEnd")]
    public DateTime SlotEnd { get; set; }
}

public class BookingConfirmedMessage
{
    [JsonPropertyName("messageId")]
    public string MessageId { get; set; } = string.Empty;

    [JsonPropertyName("bookingId")]
    public Guid BookingId { get; set; }

    [JsonPropertyName("confirmedAt")]
    public DateTime ConfirmedAt { get; set; }
}

public class BookingRejectedMessage
{
    [JsonPropertyName("messageId")]
    public string MessageId { get; set; } = string.Empty;

    [JsonPropertyName("bookingId")]
    public Guid BookingId { get; set; }

    [JsonPropertyName("rejectedAt")]
    public DateTime RejectedAt { get; set; }

    [JsonPropertyName("rejectionReason")]
    public string RejectionReason { get; set; } = string.Empty;
}
