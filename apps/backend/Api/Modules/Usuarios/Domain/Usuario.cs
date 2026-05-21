namespace Api.Modules.Usuarios.Domain;

public class Usuario
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Email { get; private set; } = null!;
    public string SenhaHash { get; private set; } = null!;
    public Guid EmpresaId { get; private set; }
    public bool Ativo { get; private set; } = true;
    public DateTime CriadoEm { get; private set; } = DateTime.UtcNow;

    private Usuario() { }

    public Usuario(string email, string senhaHash, Guid empresaId)
    {
        DefinirEmail(email);
        DefinirSenhaHash(senhaHash);
        EmpresaId = empresaId;
    }

    public void DefinirEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email é obrigatório.");
        Email = email.Trim().ToLowerInvariant();
    }

    public void DefinirSenhaHash(string senhaHash)
    {
        if (string.IsNullOrWhiteSpace(senhaHash))
            throw new ArgumentException("Senha hash é obrigatória.");
        SenhaHash = senhaHash;
    }
}
