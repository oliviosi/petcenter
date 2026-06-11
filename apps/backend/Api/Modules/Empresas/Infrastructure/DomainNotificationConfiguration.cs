using Api.Modules.Empresas.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Empresas.Infrastructure;

public class DomainNotificationConfiguration : IEntityTypeConfiguration<DomainNotification>
{
    public void Configure(EntityTypeBuilder<DomainNotification> builder)
    {
        builder.ToTable("domain_notifications");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Outcome).HasColumnName("outcome").HasMaxLength(100).IsRequired(false);
        builder.Property(x => x.Category).HasColumnName("category").HasMaxLength(100).IsRequired();
        builder.Property(x => x.Reason).HasColumnName("reason").HasMaxLength(200).IsRequired(false);
        builder.Property(x => x.Payload).HasColumnName("payload").IsRequired(false);
        builder.Property(x => x.Attempts).HasColumnName("attempts").IsRequired();
        builder.Property(x => x.SentAt).HasColumnName("sent_at").IsRequired(false);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(x => x.EmpresaId).HasColumnName("empresa_id").IsRequired();

        builder.HasIndex(x => x.EmpresaId).HasDatabaseName("ix_domain_notifications_empresa_id");
        builder.HasIndex(x => x.CreatedAt).HasDatabaseName("ix_domain_notifications_created_at");
    }
}
