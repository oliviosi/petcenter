using Api.Infrastructure.Persistence;
using Api.Modules.Empresas.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Modules.Empresas.Infrastructure;

public class EmpresaRepository : IEmpresaRepository
{
    private readonly AppDbContext _db;

    public EmpresaRepository(AppDbContext db) => _db = db;

    public async Task<Empresa?> GetByIdAsync(Guid id) =>
        await _db.Empresas.FirstOrDefaultAsync(e => e.Id == id);

    public async Task<Empresa?> GetPublicByIdAsync(Guid id) =>
        await _db.Empresas.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id && e.Ativo && e.Publica);

    public async Task<Empresa?> GetBySlugAsync(string slug)
    {
        var slugNormalizado = slug.Trim().ToLowerInvariant();
        return await _db.Empresas.FirstOrDefaultAsync(e => e.Slug == slugNormalizado);
    }

    public async Task<Empresa?> GetPublicBySlugAsync(string slug)
    {
        var slugNormalizado = slug.Trim().ToLowerInvariant();
        return await _db.Empresas.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Ativo && e.Publica && e.Slug == slugNormalizado);
    }

    public async Task<List<Empresa>> ListPublicAsync(string? nome = null, string? cidade = null, string? bairro = null, string? servico = null)
    {
        var query = _db.Empresas.AsNoTracking()
            .Where(e => e.Ativo && e.Publica);

        if (!string.IsNullOrWhiteSpace(nome))
        {
            var nomeFiltro = $"%{nome.Trim()}%";
            query = query.Where(e => EF.Functions.ILike(e.Nome, nomeFiltro));
        }

        if (!string.IsNullOrWhiteSpace(cidade))
        {
            var cidadeFiltro = $"%{cidade.Trim()}%";
            query = query.Where(e => e.Cidade != null && EF.Functions.ILike(e.Cidade, cidadeFiltro));
        }

        if (!string.IsNullOrWhiteSpace(bairro))
        {
            var bairroFiltro = $"%{bairro.Trim()}%";
            query = query.Where(e => e.Bairro != null && EF.Functions.ILike(e.Bairro, bairroFiltro));
        }

        if (!string.IsNullOrWhiteSpace(servico))
        {
            var servicoFiltro = $"%{servico.Trim()}%";
            query = query.Where(e => _db.Servicos.Any(s =>
                s.EmpresaId == e.Id
                && s.Ativo
                && EF.Functions.ILike(s.Nome, servicoFiltro)));
        }

        return await query
            .OrderBy(e => e.Nome)
            .ToListAsync();
    }

    public async Task UpdateAsync(Empresa empresa)
    {
        _db.Empresas.Update(empresa);
        await _db.SaveChangesAsync();
    }
}
