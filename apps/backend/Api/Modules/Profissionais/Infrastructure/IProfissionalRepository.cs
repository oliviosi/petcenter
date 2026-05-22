using Api.Modules.Profissionais.Domain;

namespace Api.Modules.Profissionais.Infrastructure;

public interface IProfissionalRepository
{
    Task AddAsync(Profissional profissional);
    Task<Profissional?> GetByIdAsync(Guid id, Guid empresaId);
    Task<List<Profissional>> ListByEmpresaAsync(Guid empresaId);
    Task<List<Profissional>> ListAtivosByEmpresaAsync(Guid empresaId);
    Task<List<Profissional>> ListByIdsAsync(Guid empresaId, IEnumerable<Guid> ids);
    Task UpdateAsync(Profissional profissional);
}
