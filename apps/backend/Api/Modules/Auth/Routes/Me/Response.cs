namespace Api.Modules.Auth.Routes.Me;

public class GetMeResponse
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public EmpresaSummary Empresa { get; set; } = null!;
}

public class EmpresaSummary
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
}
