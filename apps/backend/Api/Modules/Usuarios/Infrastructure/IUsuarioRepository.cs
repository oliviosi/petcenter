using Api.Modules.Usuarios.Domain;

namespace Api.Modules.Usuarios.Infrastructure;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task<Usuario?> GetByIdAsync(Guid id, Guid empresaId);
}
