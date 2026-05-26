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

    public async Task<Empresa?> GetByCustomDomainAsync(string domain)
    {
        var domainNormalizado = NormalizeHost(domain);
        return await _db.Empresas.FirstOrDefaultAsync(e =>
            e.DominioPersonalizadoDesejado == domainNormalizado
            || e.DominioPersonalizadoAtivo == domainNormalizado);
    }

    public async Task<Empresa?> GetPublicBySlugAsync(string slug)
    {
        var slugNormalizado = slug.Trim().ToLowerInvariant();
        return await _db.Empresas.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Ativo && e.Publica && e.Slug == slugNormalizado);
    }

    public async Task<Empresa?> GetPublicByHostAsync(string host)
    {
        var hostNormalizado = NormalizeHost(host);
        return await _db.Empresas.AsNoTracking()
            .FirstOrDefaultAsync(e =>
                e.Ativo
                && e.Publica
                && e.DominioPersonalizadoStatus == StorefrontCustomDomainStatus.Active
                && e.DominioPersonalizadoAtivo == hostNormalizado);
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

    public async Task<EmpresaPublicRatingSummary?> GetPublicRatingSummaryAsync(Guid empresaId)
    {
        var summaries = await GetPublicRatingSummariesAsync([empresaId]);
        return summaries.GetValueOrDefault(empresaId);
    }

    public async Task<Dictionary<Guid, EmpresaPublicRatingSummary>> GetPublicRatingSummariesAsync(IEnumerable<Guid> empresaIds)
    {
        var ids = empresaIds.Distinct().ToArray();
        if (ids.Length == 0)
            return [];

        var summaries = await _db.BookingFeedbacks.AsNoTracking()
            .Where(feedback => ids.Contains(feedback.EmpresaId))
            .GroupBy(feedback => feedback.EmpresaId)
            .Select(group => new
            {
                EmpresaId = group.Key,
                AverageRating = group.Average(feedback => (decimal)feedback.PetshopRating),
                FeedbackCount = group.Count()
            })
            .ToListAsync();

        return summaries.ToDictionary(
            summary => summary.EmpresaId,
            summary => new EmpresaPublicRatingSummary
            {
                EmpresaId = summary.EmpresaId,
                AverageRating = decimal.Round(summary.AverageRating, 2, MidpointRounding.AwayFromZero),
                FeedbackCount = summary.FeedbackCount
            });
    }

    public async Task UpdateAsync(Empresa empresa)
    {
        _db.Empresas.Update(empresa);
        await _db.SaveChangesAsync();
    }

    private static string NormalizeHost(string host) =>
        host.Trim().ToLowerInvariant().TrimEnd('.').Split(':', 2)[0];
}
