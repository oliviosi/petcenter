using System.Text.RegularExpressions;

namespace Api.Modules.Empresas.Domain;

public partial class Empresa
{
    private static readonly Regex SlugRegex = SlugPattern();
    private static readonly Regex CustomDomainRegex = CustomDomainPattern();

    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Nome { get; private set; } = null!;
    public string? Slug { get; private set; }
    public string? Descricao { get; private set; }
    public string? Cidade { get; private set; }
    public string? Bairro { get; private set; }
    public string? ResumoContato { get; private set; }
    public string? ResumoEndereco { get; private set; }
    public string? DominioPersonalizadoDesejado { get; private set; }
    public string? DominioPersonalizadoAtivo { get; private set; }
    public string? DominioPersonalizadoUltimaFalha { get; private set; }
    public StorefrontCustomDomainStatus DominioPersonalizadoStatus { get; private set; } =
        StorefrontCustomDomainStatus.Removed;
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

    public void DefinirDominioPersonalizadoDesejado(string? dominio)
    {
        if (string.IsNullOrWhiteSpace(dominio))
        {
            RemoverDominioPersonalizado();
            return;
        }

        var dominioNormalizado = NormalizarDominioPersonalizado(dominio);
        if (DominioPersonalizadoDesejado == dominioNormalizado)
            return;

        DominioPersonalizadoDesejado = dominioNormalizado;
        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoUltimaFalha = null;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.PendingSetup;
    }

    public void MarcarDominioPersonalizadoEmVerificacao()
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");

        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoUltimaFalha = null;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Verifying;
    }

    public void AtivarDominioPersonalizado()
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");

        DominioPersonalizadoAtivo = DominioPersonalizadoDesejado;
        DominioPersonalizadoUltimaFalha = null;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Active;
    }

    public void RegistrarFalhaDominioPersonalizado(string motivo)
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");
        if (string.IsNullOrWhiteSpace(motivo))
            throw new ArgumentException("Motivo é obrigatório.");

        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoUltimaFalha = motivo.Trim();
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Failed;
    }

    public void RemoverDominioPersonalizado()
    {
        DominioPersonalizadoDesejado = null;
        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoUltimaFalha = null;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Removed;
    }

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

    private static string NormalizarDominioPersonalizado(string dominio)
    {
        var dominioNormalizado = dominio.Trim().ToLowerInvariant().TrimEnd('.');
        if (!CustomDomainRegex.IsMatch(dominioNormalizado))
            throw new ArgumentException("Domínio personalizado inválido.");

        return dominioNormalizado;
    }

    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex SlugPattern();

    [GeneratedRegex("^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$")]
    private static partial Regex CustomDomainPattern();
}
