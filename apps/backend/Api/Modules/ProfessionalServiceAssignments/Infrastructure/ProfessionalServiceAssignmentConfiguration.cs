using Api.Modules.Empresas.Domain;
using Api.Modules.ProfessionalServiceAssignments.Domain;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.ProfessionalServiceAssignments.Infrastructure;

public class ProfessionalServiceAssignmentConfiguration : IEntityTypeConfiguration<ProfessionalServiceAssignment>
{
    public void Configure(EntityTypeBuilder<ProfessionalServiceAssignment> builder)
    {
        builder.ToTable("professional_service_assignments");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.EmpresaId).IsRequired();
        builder.Property(a => a.ProfessionalId).IsRequired();
        builder.Property(a => a.ServiceId).IsRequired();
        builder.Property(a => a.CreatedAt).IsRequired();

        builder.HasIndex(a => new { a.EmpresaId, a.ProfessionalId, a.ServiceId }).IsUnique();
        builder.HasIndex(a => new { a.EmpresaId, a.ServiceId });

        builder.HasOne<Empresa>().WithMany().HasForeignKey(a => a.EmpresaId).IsRequired();
        builder.HasOne<Profissional>().WithMany().HasForeignKey(a => a.ProfessionalId).IsRequired();
        builder.HasOne<Servico>().WithMany().HasForeignKey(a => a.ServiceId).IsRequired();
    }
}
