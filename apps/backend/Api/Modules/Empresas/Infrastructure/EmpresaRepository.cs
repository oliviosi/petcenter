using Api.Infrastructure.Persistence;
using Api.Modules.Empresas.Domain;

namespace Api.Modules.Empresas.Infrastructure;

public class EmpresaRepository : IEmpresaRepository
{
    private readonly AppDbContext _db;

    public EmpresaRepository(AppDbContext db) => _db = db;

    public async Task<Empresa?> GetByIdAsync(Guid id) =>
        await _db.Empresas.FindAsync(id);
}
