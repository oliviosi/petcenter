using Microsoft.Extensions.Options;

namespace Api.Modules.Empresas.Infrastructure;

public class StorefrontDomainVerificationService : IStorefrontDomainVerificationService
{
    private readonly IEmpresaRepository _empresaRepository;
    private readonly IStorefrontDomainDnsVerificationService _dnsVerificationService;
    private readonly StorefrontDomainVerificationOptions _options;
    private readonly TimeProvider _timeProvider;

    public StorefrontDomainVerificationService(
        IEmpresaRepository empresaRepository,
        IStorefrontDomainDnsVerificationService dnsVerificationService,
        IOptions<StorefrontDomainVerificationOptions> options,
        TimeProvider timeProvider)
    {
        _empresaRepository = empresaRepository;
        _dnsVerificationService = dnsVerificationService;
        _options = options.Value;
        _timeProvider = timeProvider;
    }

    public async Task ProcessPendingAsync(CancellationToken cancellationToken = default)
    {
        var agora = _timeProvider.GetUtcNow().UtcDateTime;
        var empresas = await _empresaRepository.ListEligibleForDomainVerificationAsync(agora, _options.BatchSize);

        foreach (var empresa in empresas)
        {
            if (string.IsNullOrWhiteSpace(empresa.DominioPersonalizadoDesejado))
                continue;

            var proximaTentativa = agora.Add(_options.RetryDelay);
            empresa.MarcarDominioPersonalizadoEmVerificacao(agora, proximaTentativa);
            await _empresaRepository.UpdateAsync(empresa);

            var resultado = await _dnsVerificationService.VerifyAsync(
                empresa.DominioPersonalizadoDesejado,
                cancellationToken);

            if (resultado.IsVerified)
                empresa.AtivarDominioPersonalizado(agora, agora);
            else
                empresa.RegistrarFalhaDominioPersonalizado(resultado.Message, agora, proximaTentativa);

            await _empresaRepository.UpdateAsync(empresa);
        }
    }
}
