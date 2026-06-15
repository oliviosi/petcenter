using Api.Infrastructure.Persistence;
using Api.Modules.Clients.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Clients.Infrastructure;

public class ClienteRepository : IClienteRepository
{
    private readonly AppDbContext _db;

    public ClienteRepository(AppDbContext db) => _db = db;

    public async Task<Cliente?> GetByEmailAsync(string email) =>
        await _db.Set<Cliente>().FirstOrDefaultAsync(c => c.Email == email.Trim().ToLowerInvariant());

    public async Task AddAsync(Cliente cliente)
    {
        await _db.Set<Cliente>().AddAsync(cliente);
        await _db.SaveChangesAsync();
    }

    public async Task<Cliente?> GetByIdAsync(Guid id) =>
        await _db.Set<Cliente>().FindAsync(id);
}
