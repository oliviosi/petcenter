using Api.Modules.Bookings.Domain;
using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Bookings.Infrastructure;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("bookings");
        builder.HasKey(b => b.Id);

        builder.Property(b => b.EmpresaId).IsRequired();
        builder.Property(b => b.ProfessionalId).IsRequired();
        builder.Property(b => b.ServiceId).IsRequired();
        builder.Property(b => b.ClientId).IsRequired();
        builder.Property(b => b.OwnerContact).IsRequired().HasMaxLength(200);
        builder.Property(b => b.PetName).IsRequired().HasMaxLength(120);
        builder.Property(b => b.PetSpecies).IsRequired().HasMaxLength(120);
        builder.Property(b => b.SlotStart).IsRequired();
        builder.Property(b => b.SlotEnd).IsRequired();
        builder.Property(b => b.State).IsRequired().HasMaxLength(30);
        builder.Property(b => b.RequestedAt).IsRequired();
        builder.Property(b => b.ConfirmedAt);
        builder.Property(b => b.RejectedAt);
        builder.Property(b => b.RejectionReason).HasMaxLength(500);
        builder.Property(b => b.CompletedAt);
        builder.Property(b => b.FinalChargedPrice).HasPrecision(10, 2);
        builder.Property(b => b.CancelledAt);
        builder.Property(b => b.CancellationReason).HasMaxLength(500);
        builder.Property(b => b.NoShowAt);
        builder.Property(b => b.NoShowReason).HasMaxLength(500);
        builder.Property(b => b.BookingStatusAccessTokenHash).IsRequired().HasMaxLength(100);
        builder.Property(b => b.FeedbackAccessTokenHash).IsRequired().HasMaxLength(100);
        builder.Property(b => b.FeedbackSubmittedAt);

        builder.HasIndex(b => new { b.EmpresaId, b.ProfessionalId, b.SlotStart, b.State });
        builder.HasIndex(b => new { b.EmpresaId, b.ServiceId, b.SlotStart });

        builder.HasOne<Empresa>().WithMany().HasForeignKey(b => b.EmpresaId).IsRequired();
        builder.HasOne<Profissional>().WithMany().HasForeignKey(b => b.ProfessionalId).IsRequired();
        builder.HasOne<Servico>().WithMany().HasForeignKey(b => b.ServiceId).IsRequired();
    }
}
