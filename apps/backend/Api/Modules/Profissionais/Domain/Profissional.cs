namespace Api.Modules.Profissionais.Domain;

public class Profissional
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid EmpresaId { get; private set; }
    public string Nome { get; private set; } = null!;
    public string? Especialidade { get; private set; }
    public bool Ativo { get; private set; } = true;
    public DateTime CriadoEm { get; private set; } = DateTime.UtcNow;

    private Profissional() { }

    public Profissional(Guid empresaId, string nome, string? especialidade = null)
    {
        EmpresaId = empresaId;
        DefinirNome(nome);
        if (especialidade is not null) DefinirEspecialidade(especialidade);
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.");
        Nome = nome.Trim();
    }

    public void DefinirEspecialidade(string especialidade)
    {
        if (string.IsNullOrWhiteSpace(especialidade))
            throw new ArgumentException("Especialidade inválida.");
        Especialidade = especialidade.Trim();
    }

    public void Ativar() => Ativo = true;
    public void Desativar() => Ativo = false;
}
