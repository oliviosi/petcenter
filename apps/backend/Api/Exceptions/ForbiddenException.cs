namespace Api.Exceptions;

public class ForbiddenException : DomainException
{
    public override int StatusCode => StatusCodes.Status403Forbidden;
    public ForbiddenException(string message) : base(message) { }
}
