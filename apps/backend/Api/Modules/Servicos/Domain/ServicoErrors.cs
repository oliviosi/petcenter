using Api.Exceptions;

namespace Api.Modules.Servicos.Domain;

public class ServicoNotFoundException : NotFoundException
{
    public ServicoNotFoundException(Guid id)
        : base($"Serviço '{id}' não encontrado.") { }
}

public class ServicoForbiddenException : ForbiddenException
{
    public ServicoForbiddenException()
        : base("Acesso ao serviço não permitido.") { }
}
