using Api.Exceptions;

namespace Api.Modules.Profissionais.Domain;

public class ProfissionalNotFoundException : NotFoundException
{
    public ProfissionalNotFoundException(Guid id)
        : base($"Profissional '{id}' não encontrado.") { }
}

public class ProfissionalForbiddenException : ForbiddenException
{
    public ProfissionalForbiddenException()
        : base("Acesso ao profissional não permitido.") { }
}
