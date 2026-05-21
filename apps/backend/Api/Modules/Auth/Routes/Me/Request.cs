namespace Api.Modules.Auth.Routes.Me;

public class GetMeRequest
{
    public Guid UserId { get; set; }
    public Guid EmpresaId { get; set; }
}
