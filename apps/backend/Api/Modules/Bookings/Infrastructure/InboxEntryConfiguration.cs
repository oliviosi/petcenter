using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Bookings.Infrastructure;

public class InboxEntryConfiguration : IEntityTypeConfiguration<InboxEntry>
{
    public void Configure(EntityTypeBuilder<InboxEntry> builder)
    {
        builder.ToTable("inbox_entries");
        builder.HasKey(i => i.MessageId);
        builder.Property(i => i.MessageId).HasMaxLength(200);
        builder.Property(i => i.EventName).IsRequired().HasMaxLength(120);
        builder.Property(i => i.ProcessedAt).IsRequired();
        builder.Property(i => i.CreatedAt).IsRequired();
    }
}
