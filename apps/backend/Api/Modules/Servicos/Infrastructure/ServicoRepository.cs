using Api.Infrastructure.Persistence;
using Api.Modules.Servicos.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Servicos.Infrastructure;

public class ServicoRepository : IServicoRepository
{
    private readonly AppDbContext _db;

    public ServicoRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(Servico servico)
    {
        _db.Servicos.Add(servico);
        await _db.SaveChangesAsync();
    }

    public async Task<Servico?> GetByIdAsync(Guid id, Guid empresaId) =>
        await _db.Servicos.FirstOrDefaultAsync(s => s.Id == id && s.EmpresaId == empresaId);

    public async Task<List<Servico>> ListByEmpresaAsync(Guid empresaId) =>
        await _db.Servicos
            .Where(s => s.EmpresaId == empresaId)
            .OrderByDescending(s => s.CriadoEm)
            .ToListAsync();

    public async Task<List<Servico>> ListAtivosByEmpresaAsync(Guid empresaId) =>
        await _db.Servicos.AsNoTracking()
            .Where(s => s.EmpresaId == empresaId && s.Ativo)
            .OrderBy(s => s.Nome)
            .ToListAsync();

    public async Task<List<Servico>> ListByIdsAsync(Guid empresaId, IEnumerable<Guid> ids)
    {
        var serviceIds = ids.Distinct().ToArray();
        if (serviceIds.Length == 0)
            return [];

        return await _db.Servicos.AsNoTracking()
            .Where(s => s.EmpresaId == empresaId && serviceIds.Contains(s.Id))
            .OrderBy(s => s.Nome)
            .ToListAsync();
    }

    public async Task UpdateAsync(Servico servico)
    {
        _db.Servicos.Update(servico);
        await _db.SaveChangesAsync();
    }
}
