using Api.Infrastructure.Persistence;
using Api.Modules.Usuarios.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Usuarios.Infrastructure;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _db;

    public UsuarioRepository(AppDbContext db) => _db = db;

    public async Task<Usuario?> GetByEmailAsync(string email) =>
        await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == email.Trim().ToLowerInvariant());

    public async Task<Usuario?> GetByIdAsync(Guid id, Guid empresaId) =>
        await _db.Usuarios.FirstOrDefaultAsync(u => u.Id == id && u.EmpresaId == empresaId);
}
