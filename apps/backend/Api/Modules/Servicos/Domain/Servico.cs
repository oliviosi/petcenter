namespace Api.Modules.Servicos.Domain;

public class Servico
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid EmpresaId { get; private set; }
    public string Nome { get; private set; } = null!;
    public int DuracaoMinutos { get; private set; }
    public decimal PrecoBase { get; private set; }
    public bool Ativo { get; private set; } = true;
    public DateTime CriadoEm { get; private set; } = DateTime.UtcNow;

    private Servico() { }

    public Servico(Guid empresaId, string nome, int duracaoMinutos, decimal precoBase)
    {
        EmpresaId = empresaId;
        DefinirNome(nome);
        DefinirDuracao(duracaoMinutos);
        DefinirPreco(precoBase);
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.");
        Nome = nome.Trim();
    }

    public void DefinirDuracao(int duracaoMinutos)
    {
        if (duracaoMinutos <= 0)
            throw new ArgumentException("Duração deve ser maior que zero.");
        DuracaoMinutos = duracaoMinutos;
    }

    public void DefinirPreco(decimal precoBase)
    {
        if (precoBase < 0)
            throw new ArgumentException("Preço base não pode ser negativo.");
        PrecoBase = precoBase;
    }

    public void Ativar() => Ativo = true;
    public void Desativar() => Ativo = false;
}
