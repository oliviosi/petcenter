namespace Api.Exceptions;

public class ClientAlreadyExistsException : DomainException
{
    public ClientAlreadyExistsException(string email) : base($"Email '{email}' já cadastrado.") { }
}
