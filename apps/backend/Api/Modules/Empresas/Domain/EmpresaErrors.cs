using Api.Exceptions;

namespace Api.Modules.Empresas.Domain;

public class EmpresaNotFoundException : NotFoundException
{
    public EmpresaNotFoundException(Guid id)
        : base($"Empresa '{id}' não encontrada.") { }
}
