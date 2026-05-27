using Api.Modules.Empresas.Domain;
using Microsoft.Extensions.Options;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainVerificationService : IStorefrontDomainVerificationService
{
    private readonly IEmpresaRepository _empresaRepository;
    private readonly IStorefrontDomainDnsVerificationService _dnsVerificationService;
    private readonly IStorefrontDomainCertificateReadinessService _certificateReadinessService;
    private readonly StorefrontDomainVerificationOptions _dnsOptions;
    private readonly StorefrontDomainCertificateReadinessOptions _tlsOptions;
    private readonly TimeProvider _timeProvider;

    public StorefrontDomainVerificationService(
        IEmpresaRepository empresaRepository,
        IStorefrontDomainDnsVerificationService dnsVerificationService,
        IStorefrontDomainCertificateReadinessService certificateReadinessService,
        IOptions<StorefrontDomainVerificationOptions> options,
        IOptions<StorefrontDomainCertificateReadinessOptions> certificateOptions,
        TimeProvider timeProvider)
    {
        _empresaRepository = empresaRepository;
        _dnsVerificationService = dnsVerificationService;
        _certificateReadinessService = certificateReadinessService;
        _dnsOptions = options.Value;
        _tlsOptions = certificateOptions.Value;
        _timeProvider = timeProvider;
    }

    public async Task ProcessPendingAsync(CancellationToken cancellationToken = default)
    {
        var agora = _timeProvider.GetUtcNow().UtcDateTime;
        var empresas = await _empresaRepository.ListEligibleForDomainAutomationAsync(agora, _dnsOptions.BatchSize);

        foreach (var empresa in empresas)
        {
            if (string.IsNullOrWhiteSpace(empresa.DominioPersonalizadoDesejado))
                continue;

            if (empresa.DominioPersonalizadoVerificadoEm is null)
            {
                await ProcessarDnsAsync(empresa, agora, cancellationToken);
            }
            else if (empresa.DominioPersonalizadoAtivo is null)
            {
                await ProcessarTlsAsync(empresa, agora, cancellationToken);
            }

            await _empresaRepository.UpdateAsync(empresa);
        }
    }

    private async Task ProcessarDnsAsync(Empresa empresa, DateTime agora, CancellationToken cancellationToken)
    {
        var proximaTentativaDns = agora.Add(_dnsOptions.RetryDelay);
        empresa.MarcarDominioPersonalizadoEmVerificacao(agora, proximaTentativaDns);
        await _empresaRepository.UpdateAsync(empresa);

        var resultadoDns = await _dnsVerificationService.VerifyAsync(
            empresa.DominioPersonalizadoDesejado!,
            cancellationToken);

        if (!resultadoDns.IsVerified)
        {
            empresa.RegistrarFalhaDominioPersonalizado(resultadoDns.Message, agora, proximaTentativaDns);
            return;
        }

        empresa.MarcarDominioPersonalizadoDnsVerificado(agora, agora);
        await _empresaRepository.UpdateAsync(empresa);

        await ProcessarTlsAsync(empresa, agora, cancellationToken);
    }

    private async Task ProcessarTlsAsync(Empresa empresa, DateTime agora, CancellationToken cancellationToken)
    {
        var proximaTentativaTls = agora.Add(_tlsOptions.RetryDelay);
        empresa.MarcarDominioPersonalizadoTlsEmProvisionamento(agora, proximaTentativaTls);
        await _empresaRepository.UpdateAsync(empresa);

        var resultadoTls = await _certificateReadinessService.CheckAsync(
            empresa.DominioPersonalizadoDesejado!,
            cancellationToken);

        if (resultadoTls.IsReady)
            empresa.AtivarDominioPersonalizado(agora, agora);
        else
            empresa.RegistrarFalhaTlsDominioPersonalizado(resultadoTls.Message, agora, proximaTentativaTls);
    }
}
