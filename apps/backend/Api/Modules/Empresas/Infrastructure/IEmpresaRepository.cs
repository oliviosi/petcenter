using Api.Modules.Empresas.Domain;

namespace Api.Modules.Empresas.Infrastructure;

public interface IEmpresaRepository
{
    Task<Empresa?> GetByIdAsync(Guid id);
    Task<Empresa?> GetPublicByIdAsync(Guid id);
    Task<Empresa?> GetBySlugAsync(string slug);
    Task<Empresa?> GetPublicBySlugAsync(string slug);
    Task<List<Empresa>> ListPublicAsync(string? nome = null, string? cidade = null, string? bairro = null, string? servico = null);
    Task UpdateAsync(Empresa empresa);
}
