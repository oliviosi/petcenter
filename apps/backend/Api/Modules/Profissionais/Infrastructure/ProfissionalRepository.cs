using Api.Infrastructure.Persistence;
using Api.Modules.Profissionais.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Profissionais.Infrastructure;

public class ProfissionalRepository : IProfissionalRepository
{
    private readonly AppDbContext _db;

    public ProfissionalRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(Profissional profissional)
    {
        _db.Profissionais.Add(profissional);
        await _db.SaveChangesAsync();
    }

    public async Task<Profissional?> GetByIdAsync(Guid id, Guid empresaId) =>
        await _db.Profissionais.FirstOrDefaultAsync(p => p.Id == id && p.EmpresaId == empresaId);

    public async Task<List<Profissional>> ListByEmpresaAsync(Guid empresaId) =>
        await _db.Profissionais
            .Where(p => p.EmpresaId == empresaId)
            .OrderByDescending(p => p.CriadoEm)
            .ToListAsync();

    public async Task<List<Profissional>> ListAtivosByEmpresaAsync(Guid empresaId) =>
        await _db.Profissionais.AsNoTracking()
            .Where(p => p.EmpresaId == empresaId && p.Ativo)
            .OrderBy(p => p.Nome)
            .ToListAsync();

    public async Task<List<Profissional>> ListByIdsAsync(Guid empresaId, IEnumerable<Guid> ids)
    {
        var professionalIds = ids.Distinct().ToArray();
        if (professionalIds.Length == 0)
                    return new List<Profissional>();

        return await _db.Profissionais.AsNoTracking()
            .Where(p => p.EmpresaId == empresaId && professionalIds.Contains(p.Id))
            .OrderBy(p => p.Nome)
            .ToListAsync();
    }

    public async Task UpdateAsync(Profissional profissional)
    {
        _db.Profissionais.Update(profissional);
        await _db.SaveChangesAsync();
    }
}
