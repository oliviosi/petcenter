using Api.Modules.Empresas.Domain;

namespace Api.Modules.Empresas.Infrastructure;

public interface IEmpresaRepository
{
    Task<Empresa?> GetByIdAsync(Guid id);
}
