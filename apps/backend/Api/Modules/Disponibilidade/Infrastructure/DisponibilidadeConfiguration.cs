using Api.Modules.Profissionais.Domain;
using Api.Modules.Disponibilidade.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Disponibilidade.Infrastructure;

public class DisponibilidadeConfiguration : IEntityTypeConfiguration<DisponibilidadeProfissional>
{
    public void Configure(EntityTypeBuilder<DisponibilidadeProfissional> builder)
    {
        builder.ToTable("disponibilidades_profissionais");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.ProfissionalId).IsRequired();
        builder.Property(d => d.DiaSemana).IsRequired().HasConversion<int>();
        builder.Property(d => d.HoraInicio).IsRequired();
        builder.Property(d => d.HoraFim).IsRequired();
        builder.Property(d => d.CriadoEm).IsRequired();
        builder.HasIndex(d => d.ProfissionalId);
        builder.HasOne<Profissional>().WithMany().HasForeignKey(d => d.ProfissionalId).IsRequired();
    }
}
