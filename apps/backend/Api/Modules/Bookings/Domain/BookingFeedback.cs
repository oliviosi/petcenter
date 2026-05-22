namespace Api.Modules.Bookings.Domain;

public class BookingFeedback
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid BookingId { get; private set; }
    public Guid EmpresaId { get; private set; }
    public Guid ProfessionalId { get; private set; }
    public int ProfessionalRating { get; private set; }
    public int PetshopRating { get; private set; }
    public string? Comment { get; private set; }
    public DateTime SubmittedAt { get; private set; }

    private BookingFeedback() { }

    public BookingFeedback(
        Guid bookingId,
        Guid empresaId,
        Guid professionalId,
        int professionalRating,
        int petshopRating,
        string? comment,
        DateTime submittedAt)
    {
        if (bookingId == Guid.Empty)
            throw new ArgumentException("Reserva inválida.");
        if (empresaId == Guid.Empty)
            throw new ArgumentException("Empresa inválida.");
        if (professionalId == Guid.Empty)
            throw new ArgumentException("Profissional inválido.");

        BookingId = bookingId;
        EmpresaId = empresaId;
        ProfessionalId = professionalId;

        DefinirProfessionalRating(professionalRating);
        DefinirPetshopRating(petshopRating);
        DefinirComment(comment);
        SubmittedAt = NormalizeUtc(submittedAt);
    }

    private void DefinirProfessionalRating(int professionalRating)
    {
        if (professionalRating is < 1 or > 5)
            throw new BookingFeedbackRatingOutOfRangeException();

        ProfessionalRating = professionalRating;
    }

    private void DefinirPetshopRating(int petshopRating)
    {
        if (petshopRating is < 1 or > 5)
            throw new BookingFeedbackRatingOutOfRangeException();

        PetshopRating = petshopRating;
    }

    private void DefinirComment(string? comment)
    {
        if (comment is null)
        {
            Comment = null;
            return;
        }

        var trimmedComment = comment.Trim();
        if (string.IsNullOrWhiteSpace(trimmedComment))
        {
            Comment = null;
            return;
        }

        if (trimmedComment.Length > 1000)
            throw new ArgumentException("Comentário deve ter no máximo 1000 caracteres.");

        Comment = trimmedComment;
    }

    private static DateTime NormalizeUtc(DateTime value) =>
        value.Kind == DateTimeKind.Utc
            ? value
            : value.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(value, DateTimeKind.Utc)
                : value.ToUniversalTime();
}
