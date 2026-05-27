using Api.Modules.Empresas.Domain;

namespace Api.Modules.Empresas.Infrastructure;

public interface IEmpresaRepository
{
    Task<Empresa?> GetByIdAsync(Guid id);
    Task<Empresa?> GetPublicByIdAsync(Guid id);
    Task<Empresa?> GetBySlugAsync(string slug);
    Task<Empresa?> GetByCustomDomainAsync(string domain);
    Task<Empresa?> GetPublicBySlugAsync(string slug);
    Task<Empresa?> GetPublicByHostAsync(string host);
    Task<List<Empresa>> ListEligibleForDomainVerificationAsync(DateTime referenciaUtc, int take = 100);
    Task<List<Empresa>> ListPublicAsync(string? nome = null, string? cidade = null, string? bairro = null, string? servico = null);
    Task<EmpresaPublicRatingSummary?> GetPublicRatingSummaryAsync(Guid empresaId);
    Task<Dictionary<Guid, EmpresaPublicRatingSummary>> GetPublicRatingSummariesAsync(IEnumerable<Guid> empresaIds);
    Task UpdateAsync(Empresa empresa);
}
