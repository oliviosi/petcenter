using Api.Exceptions;

namespace Api.Modules.Disponibilidade.Domain;

public class DisponibilidadeNotFoundException : NotFoundException
{
    public DisponibilidadeNotFoundException(Guid id)
        : base($"Janela de disponibilidade '{id}' não encontrada.") { }
}

public class DisponibilidadeForbiddenException : ForbiddenException
{
    public DisponibilidadeForbiddenException()
        : base("Acesso à disponibilidade não permitido.") { }
}
