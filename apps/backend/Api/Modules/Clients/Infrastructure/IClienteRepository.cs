using Api.Modules.Clients.Domain;

namespace Api.Modules.Clients.Infrastructure;

public interface IClienteRepository
{
    Task<Cliente?> GetByEmailAsync(string email);
    Task AddAsync(Cliente cliente);
    Task<Cliente?> GetByIdAsync(Guid id);
}
