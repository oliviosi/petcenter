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
        builder.Property(e => e.DominioPersonalizadoUltimaTentativaEm)
            .HasColumnName("dominio_personalizado_ultima_tentativa_em");
        builder.Property(e => e.DominioPersonalizadoProximaTentativaEm)
            .HasColumnName("dominio_personalizado_proxima_tentativa_em");
        builder.Property(e => e.DominioPersonalizadoVerificadoEm)
            .HasColumnName("dominio_personalizado_verificado_em");
        builder.Property(e => e.DominioPersonalizadoTlsUltimaFalha)
            .HasColumnName("dominio_personalizado_tls_ultima_falha")
            .HasMaxLength(300);
        builder.Property(e => e.DominioPersonalizadoTlsProvisionamentoIniciadoEm)
            .HasColumnName("dominio_personalizado_tls_provisionamento_iniciado_em");
        builder.Property(e => e.DominioPersonalizadoTlsUltimaTentativaEm)
            .HasColumnName("dominio_personalizado_tls_ultima_tentativa_em");
        builder.Property(e => e.DominioPersonalizadoTlsProximaTentativaEm)
            .HasColumnName("dominio_personalizado_tls_proxima_tentativa_em");
        builder.Property(e => e.DominioPersonalizadoHttpsProntoEm)
            .HasColumnName("dominio_personalizado_https_pronto_em");
        builder.Property(e => e.DominioPersonalizadoAtivadoEm)
            .HasColumnName("dominio_personalizado_ativado_em");
        builder.Property(e => e.DominioPersonalizadoStatus)
            .HasColumnName("dominio_personalizado_status")
            .HasConversion<string>()
            .HasMaxLength(40);
        builder.Property(e => e.DominioPersonalizadoDnsStatus)
            .HasColumnName("dominio_personalizado_dns_status")
            .HasConversion<string>()
            .HasMaxLength(40);
        builder.Property(e => e.DominioPersonalizadoTlsStatus)
            .HasColumnName("dominio_personalizado_tls_status")
            .HasConversion<string>()
            .HasMaxLength(40);
        builder.Property(e => e.Publica).HasColumnName("publica").IsRequired();
        builder.Property(e => e.Ativo).IsRequired();
        builder.Property(e => e.CriadoEm).IsRequired();
        builder.HasIndex(e => e.Nome).IsUnique();
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.HasIndex(e => e.DominioPersonalizadoDesejado).IsUnique();
        builder.HasIndex(e => e.DominioPersonalizadoAtivo).IsUnique();
        builder.HasIndex(e => e.DominioPersonalizadoProximaTentativaEm);
        builder.HasIndex(e => e.DominioPersonalizadoTlsProximaTentativaEm);
    }
}
