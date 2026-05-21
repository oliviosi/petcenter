using Api.Exceptions;

namespace Api.Modules.Usuarios.Domain;

public class UsuarioNotFoundException : NotFoundException
{
    public UsuarioNotFoundException()
        : base("Usuário não encontrado.") { }
}

public class CredenciaisInvalidasException : UnauthorizedException
{
    public CredenciaisInvalidasException()
        : base("Credenciais inválidas.") { }
}
