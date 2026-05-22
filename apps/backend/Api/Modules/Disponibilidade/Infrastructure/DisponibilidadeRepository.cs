using Api.Infrastructure.Persistence;
using Api.Modules.Disponibilidade.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Disponibilidade.Infrastructure;

public class DisponibilidadeRepository : IDisponibilidadeRepository
{
    private readonly AppDbContext _db;

    public DisponibilidadeRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(DisponibilidadeProfissional disponibilidade)
    {
        _db.DisponibilidadesProfissionais.Add(disponibilidade);
        await _db.SaveChangesAsync();
    }

    public async Task<DisponibilidadeProfissional?> GetByIdAsync(Guid id, Guid profissionalId) =>
        await _db.DisponibilidadesProfissionais.FirstOrDefaultAsync(d => d.Id == id && d.ProfissionalId == profissionalId);

    public async Task<List<DisponibilidadeProfissional>> ListByProfissionalAsync(Guid profissionalId) =>
        await _db.DisponibilidadesProfissionais
            .Where(d => d.ProfissionalId == profissionalId)
            .OrderBy(d => d.DiaSemana)
            .ThenBy(d => d.HoraInicio)
            .ToListAsync();

    public async Task<List<DisponibilidadeProfissional>> ListByProfissionaisAsync(IEnumerable<Guid> profissionalIds)
    {
        var ids = profissionalIds.Distinct().ToArray();
        if (ids.Length == 0)
            return [];

        return await _db.DisponibilidadesProfissionais.AsNoTracking()
            .Where(d => ids.Contains(d.ProfissionalId))
            .OrderBy(d => d.ProfissionalId)
            .ThenBy(d => d.DiaSemana)
            .ThenBy(d => d.HoraInicio)
            .ToListAsync();
    }

    public async Task UpdateAsync(DisponibilidadeProfissional disponibilidade)
    {
        _db.DisponibilidadesProfissionais.Update(disponibilidade);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(DisponibilidadeProfissional disponibilidade)
    {
        _db.DisponibilidadesProfissionais.Remove(disponibilidade);
        await _db.SaveChangesAsync();
    }
}
