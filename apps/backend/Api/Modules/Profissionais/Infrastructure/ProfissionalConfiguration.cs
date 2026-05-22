using Api.Modules.Empresas.Domain;
using Api.Modules.Profissionais.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Profissionais.Infrastructure;

public class ProfissionalConfiguration : IEntityTypeConfiguration<Profissional>
{
    public void Configure(EntityTypeBuilder<Profissional> builder)
    {
        builder.ToTable("profissionais");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.EmpresaId).IsRequired();
        builder.Property(p => p.Nome).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Especialidade).HasMaxLength(200);
        builder.Property(p => p.Ativo).IsRequired();
        builder.Property(p => p.CriadoEm).IsRequired();
        builder.HasIndex(p => p.EmpresaId);
        builder.HasOne<Empresa>().WithMany().HasForeignKey(p => p.EmpresaId).IsRequired();
    }
}
