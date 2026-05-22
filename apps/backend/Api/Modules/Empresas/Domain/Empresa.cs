using System.Text.RegularExpressions;

namespace Api.Modules.Empresas.Domain;

public partial class Empresa
{
    private static readonly Regex SlugRegex = SlugPattern();

    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Nome { get; private set; } = null!;
    public string? Slug { get; private set; }
    public string? Descricao { get; private set; }
    public string? Cidade { get; private set; }
    public string? Bairro { get; private set; }
    public string? ResumoContato { get; private set; }
    public string? ResumoEndereco { get; private set; }
    public bool Publica { get; private set; }
    public bool Ativo { get; private set; } = true;
    public DateTime CriadoEm { get; private set; } = DateTime.UtcNow;

    private Empresa() { }

    public Empresa(string nome)
    {
        DefinirNome(nome);
    }

    public void DefinirNome(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome é obrigatório.");
        Nome = nome.Trim();
    }

    public void DefinirSlug(string? slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            Slug = null;
            return;
        }

        var slugNormalizado = slug.Trim().ToLowerInvariant();
        if (!SlugRegex.IsMatch(slugNormalizado))
            throw new ArgumentException("Slug inválido.");

        Slug = slugNormalizado;
    }

    public void DefinirDescricao(string? descricao) =>
        Descricao = NormalizarTextoOpcional(descricao);

    public void DefinirCidade(string? cidade) =>
        Cidade = NormalizarTextoOpcional(cidade);

    public void DefinirBairro(string? bairro) =>
        Bairro = NormalizarTextoOpcional(bairro);

    public void DefinirResumoContato(string? resumoContato) =>
        ResumoContato = NormalizarTextoOpcional(resumoContato);

    public void DefinirResumoEndereco(string? resumoEndereco) =>
        ResumoEndereco = NormalizarTextoOpcional(resumoEndereco);

    public void PublicarNoCatalogo()
    {
        if (string.IsNullOrWhiteSpace(Slug)
            || string.IsNullOrWhiteSpace(Descricao)
            || string.IsNullOrWhiteSpace(Cidade)
            || string.IsNullOrWhiteSpace(Bairro)
            || string.IsNullOrWhiteSpace(ResumoContato)
            || string.IsNullOrWhiteSpace(ResumoEndereco))
        {
            throw new EmpresaPerfilPublicoIncompletoException();
        }

        Publica = true;
    }

    public void OcultarDoCatalogo() => Publica = false;

    public void Ativar() => Ativo = true;
    public void Desativar() => Ativo = false;

    private static string? NormalizarTextoOpcional(string? valor) =>
        string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();

    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex SlugPattern();
}
