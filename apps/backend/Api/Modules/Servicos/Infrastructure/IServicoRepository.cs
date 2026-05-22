using Api.Modules.Servicos.Domain;

namespace Api.Modules.Servicos.Infrastructure;

public interface IServicoRepository
{
    Task AddAsync(Servico servico);
    Task<Servico?> GetByIdAsync(Guid id, Guid empresaId);
    Task<List<Servico>> ListByEmpresaAsync(Guid empresaId);
    Task<List<Servico>> ListAtivosByEmpresaAsync(Guid empresaId);
    Task UpdateAsync(Servico servico);
}
