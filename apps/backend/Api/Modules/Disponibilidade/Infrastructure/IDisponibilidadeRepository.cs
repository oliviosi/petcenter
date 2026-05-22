using Api.Modules.Disponibilidade.Domain;

namespace Api.Modules.Disponibilidade.Infrastructure;

public interface IDisponibilidadeRepository
{
    Task AddAsync(DisponibilidadeProfissional disponibilidade);
    Task<DisponibilidadeProfissional?> GetByIdAsync(Guid id, Guid profissionalId);
    Task<List<DisponibilidadeProfissional>> ListByProfissionalAsync(Guid profissionalId);
    Task UpdateAsync(DisponibilidadeProfissional disponibilidade);
    Task DeleteAsync(DisponibilidadeProfissional disponibilidade);
}
