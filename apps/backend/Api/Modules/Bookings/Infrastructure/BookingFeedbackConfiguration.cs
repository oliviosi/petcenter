using Api.Modules.Bookings.Domain;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingFeedbackConfiguration : IEntityTypeConfiguration<BookingFeedback>
{
    public void Configure(EntityTypeBuilder<BookingFeedback> builder)
    {
        builder.ToTable("booking_feedbacks");
        builder.HasKey(feedback => feedback.Id);

        builder.Property(feedback => feedback.BookingId).IsRequired();
        builder.Property(feedback => feedback.EmpresaId).IsRequired();
        builder.Property(feedback => feedback.ProfessionalId).IsRequired();
        builder.Property(feedback => feedback.ProfessionalRating).IsRequired();
        builder.Property(feedback => feedback.PetshopRating).IsRequired();
        builder.Property(feedback => feedback.Comment).HasMaxLength(1000);
        builder.Property(feedback => feedback.SubmittedAt).IsRequired();

        builder.HasIndex(feedback => feedback.BookingId).IsUnique();
        builder.HasIndex(feedback => feedback.EmpresaId);
        builder.HasIndex(feedback => feedback.ProfessionalId);

        builder.HasOne<Booking>().WithOne().HasForeignKey<BookingFeedback>(feedback => feedback.BookingId).IsRequired();
        builder.HasOne<Empresa>().WithMany().HasForeignKey(feedback => feedback.EmpresaId).IsRequired();
        builder.HasOne<Profissional>().WithMany().HasForeignKey(feedback => feedback.ProfessionalId).IsRequired();
    }
}
