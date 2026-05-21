using Api.Modules.Empresas.Domain;
using Api.Modules.Usuarios.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Modules.Usuarios.Infrastructure;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuarios");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(256);
        builder.Property(u => u.SenhaHash).IsRequired().HasMaxLength(100);
        builder.Property(u => u.EmpresaId).IsRequired();
        builder.Property(u => u.Ativo).IsRequired();
        builder.Property(u => u.CriadoEm).IsRequired();
        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasOne<Empresa>().WithMany().HasForeignKey(u => u.EmpresaId).IsRequired();
    }
}
