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
        builder.Property(e => e.DominioPersonalizadoDesejado)
            .HasColumnName("dominio_personalizado_desejado")
            .HasMaxLength(253);
        builder.Property(e => e.DominioPersonalizadoAtivo)
            .HasColumnName("dominio_personalizado_ativo")
            .HasMaxLength(253);
        builder.Property(e => e.DominioPersonalizadoUltimaFalha)
            .HasColumnName("dominio_personalizado_ultima_falha")
            .HasMaxLength(300);
        builder.Property(e => e.DominioPersonalizadoStatus)
            .HasColumnName("dominio_personalizado_status")
            .HasConversion<string>()
            .HasMaxLength(40);
        builder.Property(e => e.Publica).HasColumnName("publica").IsRequired();
        builder.Property(e => e.Ativo).IsRequired();
        builder.Property(e => e.CriadoEm).IsRequired();
        builder.HasIndex(e => e.Nome).IsUnique();
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.DominioPersonalizadoDesejado).IsUnique();
        builder.HasIndex(e => e.DominioPersonalizadoAtivo).IsUnique();
    }
}
