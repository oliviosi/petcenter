using Api.Modules.Empresas.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Empresas.Infrastructure;

public class EmpresaConfiguration : IEntityTypeConfiguration<Empresa>
{
    public void Configure(EntityTypeBuilder<Empresa> builder)
    {
        builder.ToTable("empresas");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Nome).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Slug).HasColumnName("slug").HasMaxLength(120);
        builder.Property(e => e.Descricao).HasColumnName("descricao").HasMaxLength(1000);
        builder.Property(e => e.Cidade).HasColumnName("cidade").HasMaxLength(120);
        builder.Property(e => e.Bairro).HasColumnName("bairro").HasMaxLength(120);
        builder.Property(e => e.ResumoContato).HasColumnName("resumo_contato").HasMaxLength(300);
        builder.Property(e => e.ResumoEndereco).HasColumnName("resumo_endereco").HasMaxLength(300);
        builder.Property(e => e.Publica).HasColumnName("publica").IsRequired();
        builder.Property(e => e.Ativo).IsRequired();
        builder.Property(e => e.CriadoEm).IsRequired();
        builder.HasIndex(e => e.Nome).IsUnique();
        builder.HasIndex(e => e.Slug).IsUnique();
    }
}
