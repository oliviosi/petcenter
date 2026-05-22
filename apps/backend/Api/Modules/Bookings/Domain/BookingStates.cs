namespace Api.Modules.Bookings.Domain;

public static class BookingStates
{
    public const string Requested = "requested";
    public const string Confirmed = "confirmed";
    public const string Rejected = "rejected";
    public const string Completed = "completed";
    public const string Cancelled = "cancelled";
    public const string NoShow = "no-show";
}
