using Api.Modules.Empresas.Domain;
using Api.Modules.Servicos.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Servicos.Infrastructure;

public class ServicoConfiguration : IEntityTypeConfiguration<Servico>
{
    public void Configure(EntityTypeBuilder<Servico> builder)
    {
        builder.ToTable("servicos");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.EmpresaId).IsRequired();
        builder.Property(s => s.Nome).IsRequired().HasMaxLength(200);
        builder.Property(s => s.DuracaoMinutos).IsRequired();
        builder.Property(s => s.PrecoBase).IsRequired().HasColumnType("numeric(10,2)");
        builder.Property(s => s.Ativo).IsRequired();
        builder.Property(s => s.CriadoEm).IsRequired();
        builder.HasIndex(s => s.EmpresaId);
        builder.HasOne<Empresa>().WithMany().HasForeignKey(s => s.EmpresaId).IsRequired();
    }
}
