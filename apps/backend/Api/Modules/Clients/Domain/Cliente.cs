namespace Api.Modules.Clients.Domain;

public class Cliente
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Email { get; private set; } = null!;
    public string SenhaHash { get; private set; } = null!;
    public string Nome { get; private set; } = string.Empty;
    public DateTime CriadoEm { get; private set; } = DateTime.UtcNow;

    private Cliente() { }

    public Cliente(string email, string senhaHash, string nome)
    {
        DefinirEmail(email);
        DefinirSenhaHash(senhaHash);
        Nome = nome ?? string.Empty;
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
