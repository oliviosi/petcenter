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
    public DateTime? DominioPersonalizadoUltimaTentativaEm { get; private set; }
    public DateTime? DominioPersonalizadoProximaTentativaEm { get; private set; }
    public DateTime? DominioPersonalizadoVerificadoEm { get; private set; }
    public string? DominioPersonalizadoTlsUltimaFalha { get; private set; }
    public DateTime? DominioPersonalizadoTlsProvisionamentoIniciadoEm { get; private set; }
    public DateTime? DominioPersonalizadoTlsUltimaTentativaEm { get; private set; }
    public DateTime? DominioPersonalizadoTlsProximaTentativaEm { get; private set; }
    public DateTime? DominioPersonalizadoHttpsProntoEm { get; private set; }
    public DateTime? DominioPersonalizadoAtivadoEm { get; private set; }
    public StorefrontCustomDomainStatus DominioPersonalizadoStatus { get; private set; } =
        StorefrontCustomDomainStatus.Removed;
    public StorefrontCustomDomainDnsStatus DominioPersonalizadoDnsStatus { get; private set; } =
        StorefrontCustomDomainDnsStatus.Removed;
    public StorefrontCustomDomainTlsStatus DominioPersonalizadoTlsStatus { get; private set; } =
        StorefrontCustomDomainTlsStatus.NotStarted;
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

    public void DefinirDominioPersonalizadoDesejado(string? dominio, DateTime agoraUtc)
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
        DominioPersonalizadoUltimaTentativaEm = null;
        DominioPersonalizadoProximaTentativaEm = GarantirUtc(agoraUtc);
        DominioPersonalizadoVerificadoEm = null;
        DominioPersonalizadoTlsUltimaFalha = null;
        DominioPersonalizadoTlsProvisionamentoIniciadoEm = null;
        DominioPersonalizadoTlsUltimaTentativaEm = null;
        DominioPersonalizadoTlsProximaTentativaEm = null;
        DominioPersonalizadoHttpsProntoEm = null;
        DominioPersonalizadoAtivadoEm = null;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.PendingSetup;
        DominioPersonalizadoDnsStatus = StorefrontCustomDomainDnsStatus.PendingSetup;
        DominioPersonalizadoTlsStatus = StorefrontCustomDomainTlsStatus.NotStarted;
    }

    public void MarcarDominioPersonalizadoEmVerificacao(DateTime tentativaEmUtc, DateTime proximaTentativaEmUtc)
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");

        DominioPersonalizadoUltimaTentativaEm = GarantirUtc(tentativaEmUtc);
        DominioPersonalizadoProximaTentativaEm = GarantirUtc(proximaTentativaEmUtc);
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Verifying;
        DominioPersonalizadoDnsStatus = StorefrontCustomDomainDnsStatus.Verifying;
    }

    public void MarcarDominioPersonalizadoDnsVerificado(DateTime verificadoEmUtc, DateTime iniciarProvisionamentoTlsEmUtc)
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");

        var verificadoEm = GarantirUtc(verificadoEmUtc);
        var provisionamentoEm = GarantirUtc(iniciarProvisionamentoTlsEmUtc);

        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoUltimaFalha = null;
        DominioPersonalizadoUltimaTentativaEm = verificadoEm;
        DominioPersonalizadoProximaTentativaEm = null;
        DominioPersonalizadoVerificadoEm = verificadoEm;
        DominioPersonalizadoDnsStatus = StorefrontCustomDomainDnsStatus.Verified;

        DominioPersonalizadoTlsProvisionamentoIniciadoEm ??= provisionamentoEm;
        DominioPersonalizadoTlsUltimaFalha = null;
        DominioPersonalizadoTlsUltimaTentativaEm = null;
        DominioPersonalizadoTlsProximaTentativaEm = provisionamentoEm;
        DominioPersonalizadoHttpsProntoEm = null;
        DominioPersonalizadoAtivadoEm = null;
        DominioPersonalizadoTlsStatus = StorefrontCustomDomainTlsStatus.Provisioning;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.ProvisioningTls;
    }

    public void MarcarDominioPersonalizadoTlsEmProvisionamento(DateTime tentativaEmUtc, DateTime proximaTentativaEmUtc)
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");
        if (DominioPersonalizadoVerificadoEm is null)
            throw new ArgumentException("Domínio personalizado ainda não foi verificado no DNS.");

        var tentativaEm = GarantirUtc(tentativaEmUtc);

        DominioPersonalizadoTlsProvisionamentoIniciadoEm ??= tentativaEm;
        DominioPersonalizadoTlsUltimaTentativaEm = tentativaEm;
        DominioPersonalizadoTlsProximaTentativaEm = GarantirUtc(proximaTentativaEmUtc);
        DominioPersonalizadoTlsStatus = StorefrontCustomDomainTlsStatus.Provisioning;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.ProvisioningTls;
    }

    public void AtivarDominioPersonalizado(DateTime httpsProntoEmUtc, DateTime ativadoEmUtc)
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");

        var httpsProntoEm = GarantirUtc(httpsProntoEmUtc);

        DominioPersonalizadoAtivo = DominioPersonalizadoDesejado;
        DominioPersonalizadoUltimaFalha = null;
        DominioPersonalizadoUltimaTentativaEm ??= DominioPersonalizadoVerificadoEm ?? httpsProntoEm;
        DominioPersonalizadoProximaTentativaEm = null;
        DominioPersonalizadoVerificadoEm ??= httpsProntoEm;
        DominioPersonalizadoDnsStatus = StorefrontCustomDomainDnsStatus.Verified;

        DominioPersonalizadoTlsProvisionamentoIniciadoEm ??= httpsProntoEm;
        DominioPersonalizadoTlsUltimaFalha = null;
        DominioPersonalizadoTlsUltimaTentativaEm = httpsProntoEm;
        DominioPersonalizadoTlsProximaTentativaEm = null;
        DominioPersonalizadoHttpsProntoEm = httpsProntoEm;
        DominioPersonalizadoTlsStatus = StorefrontCustomDomainTlsStatus.Ready;
        DominioPersonalizadoAtivadoEm = GarantirUtc(ativadoEmUtc);
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Active;
    }

    public void RegistrarFalhaDominioPersonalizado(
        string motivo,
        DateTime tentativaEmUtc,
        DateTime proximaTentativaEmUtc)
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");
        if (string.IsNullOrWhiteSpace(motivo))
            throw new ArgumentException("Motivo é obrigatório.");

        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoUltimaFalha = motivo.Trim();
        DominioPersonalizadoUltimaTentativaEm = GarantirUtc(tentativaEmUtc);
        DominioPersonalizadoProximaTentativaEm = GarantirUtc(proximaTentativaEmUtc);
        DominioPersonalizadoVerificadoEm = null;
        DominioPersonalizadoTlsUltimaFalha = null;
        DominioPersonalizadoTlsProvisionamentoIniciadoEm = null;
        DominioPersonalizadoTlsUltimaTentativaEm = null;
        DominioPersonalizadoTlsProximaTentativaEm = null;
        DominioPersonalizadoHttpsProntoEm = null;
        DominioPersonalizadoAtivadoEm = null;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Failed;
        DominioPersonalizadoDnsStatus = StorefrontCustomDomainDnsStatus.Failed;
        DominioPersonalizadoTlsStatus = StorefrontCustomDomainTlsStatus.NotStarted;
    }

    public void RegistrarFalhaTlsDominioPersonalizado(
        string motivo,
        DateTime tentativaEmUtc,
        DateTime proximaTentativaEmUtc)
    {
        if (string.IsNullOrWhiteSpace(DominioPersonalizadoDesejado))
            throw new ArgumentException("Domínio personalizado é obrigatório.");
        if (DominioPersonalizadoVerificadoEm is null)
            throw new ArgumentException("Domínio personalizado ainda não foi verificado no DNS.");
        if (string.IsNullOrWhiteSpace(motivo))
            throw new ArgumentException("Motivo é obrigatório.");

        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoTlsProvisionamentoIniciadoEm ??= GarantirUtc(tentativaEmUtc);
        DominioPersonalizadoTlsUltimaFalha = motivo.Trim();
        DominioPersonalizadoTlsUltimaTentativaEm = GarantirUtc(tentativaEmUtc);
        DominioPersonalizadoTlsProximaTentativaEm = GarantirUtc(proximaTentativaEmUtc);
        DominioPersonalizadoHttpsProntoEm = null;
        DominioPersonalizadoAtivadoEm = null;
        DominioPersonalizadoTlsStatus = StorefrontCustomDomainTlsStatus.Failed;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.TlsFailed;
    }

    public void RemoverDominioPersonalizado()
    {
        DominioPersonalizadoDesejado = null;
        DominioPersonalizadoAtivo = null;
        DominioPersonalizadoUltimaFalha = null;
        DominioPersonalizadoUltimaTentativaEm = null;
        DominioPersonalizadoProximaTentativaEm = null;
        DominioPersonalizadoVerificadoEm = null;
        DominioPersonalizadoTlsUltimaFalha = null;
        DominioPersonalizadoTlsProvisionamentoIniciadoEm = null;
        DominioPersonalizadoTlsUltimaTentativaEm = null;
        DominioPersonalizadoTlsProximaTentativaEm = null;
        DominioPersonalizadoHttpsProntoEm = null;
        DominioPersonalizadoAtivadoEm = null;
        DominioPersonalizadoStatus = StorefrontCustomDomainStatus.Removed;
        DominioPersonalizadoDnsStatus = StorefrontCustomDomainDnsStatus.Removed;
        DominioPersonalizadoTlsStatus = StorefrontCustomDomainTlsStatus.NotStarted;
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

    private static DateTime GarantirUtc(DateTime dataHora)
    {
        if (dataHora.Kind == DateTimeKind.Utc)
            return dataHora;

        return DateTime.SpecifyKind(dataHora, DateTimeKind.Utc);
    }

    [GeneratedRegex("^[a-z0-9]+(?:-[a-z0-9]+)*$")]
    private static partial Regex SlugPattern();

    [GeneratedRegex("^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$")]
    private static partial Regex CustomDomainPattern();
}
