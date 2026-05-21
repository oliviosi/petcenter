namespace Api.Exceptions;

public abstract class DomainException : Exception
{
    public virtual int StatusCode => StatusCodes.Status400BadRequest;
    protected DomainException(string message) : base(message) { }
}
