using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Tests.Support;
using Microsoft.Extensions.Options;

namespace Api.Tests.Empresas;

public class StorefrontDomainVerificationServiceTests
{
    [Fact]
    public async Task ProcessPendingAsync_ShouldHandOffDnsSuccessToTlsProvisioningAndActivateWhenHttpsIsReady()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirDominioPersonalizadoDesejado(
            "agenda.petcenter-vila.com",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var agora = new DateTimeOffset(2026, 6, 27, 9, 30, 0, TimeSpan.Zero);
        var sut = new StorefrontDomainVerificationService(
            new EmpresaRepository(db),
            new FakeStorefrontDomainDnsVerificationService(new StorefrontDomainDnsVerificationResult
            {
                IsVerified = true,
                Message = "Domínio verificado com sucesso."
            }),
            new FakeStorefrontDomainCertificateReadinessService(new StorefrontDomainCertificateReadinessResult
            {
                IsReady = true,
                Message = "HTTPS pronto para o domínio."
            }),
            Options.Create(new StorefrontDomainVerificationOptions
            {
                ExpectedTarget = "storefront.petcenter.local",
                RetryDelay = TimeSpan.FromMinutes(15),
                BatchSize = 10
            }),
            Options.Create(new StorefrontDomainCertificateReadinessOptions
            {
                ProbePath = "/",
                RetryDelay = TimeSpan.FromMinutes(15)
            }),
            new ManualTimeProvider(agora));

        await sut.ProcessPendingAsync();

        var empresaAtualizada = await db.Empresas.FindAsync(empresa.Id);
        Assert.NotNull(empresaAtualizada);
        Assert.Equal(StorefrontCustomDomainStatus.Active, empresaAtualizada!.DominioPersonalizadoStatus);
        Assert.Equal(StorefrontCustomDomainDnsStatus.Verified, empresaAtualizada.DominioPersonalizadoDnsStatus);
        Assert.Equal(StorefrontCustomDomainTlsStatus.Ready, empresaAtualizada.DominioPersonalizadoTlsStatus);
        Assert.Equal("agenda.petcenter-vila.com", empresaAtualizada.DominioPersonalizadoAtivo);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoUltimaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoProximaTentativaEm);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoVerificadoEm);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoTlsProvisionamentoIniciadoEm);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoTlsUltimaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoTlsProximaTentativaEm);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoHttpsProntoEm);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoAtivadoEm);
    }

    [Fact]
    public async Task ProcessPendingAsync_ShouldRecordRecoverableFailureAndScheduleRetry()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirDominioPersonalizadoDesejado(
            "agenda.petcenter-vila.com",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var agora = new DateTimeOffset(2026, 6, 27, 9, 30, 0, TimeSpan.Zero);
        var retryDelay = TimeSpan.FromMinutes(15);
        var sut = new StorefrontDomainVerificationService(
            new EmpresaRepository(db),
            new FakeStorefrontDomainDnsVerificationService(new StorefrontDomainDnsVerificationResult
            {
                IsVerified = false,
                Message = "O domínio ainda não aponta para o destino esperado."
            }),
            new FakeStorefrontDomainCertificateReadinessService(new StorefrontDomainCertificateReadinessResult
            {
                IsReady = false,
                Message = "HTTPS ainda não está pronto."
            }),
            Options.Create(new StorefrontDomainVerificationOptions
            {
                ExpectedTarget = "storefront.petcenter.local",
                RetryDelay = retryDelay,
                BatchSize = 10
            }),
            Options.Create(new StorefrontDomainCertificateReadinessOptions
            {
                ProbePath = "/",
                RetryDelay = retryDelay
            }),
            new ManualTimeProvider(agora));

        await sut.ProcessPendingAsync();

        var empresaAtualizada = await db.Empresas.FindAsync(empresa.Id);
        Assert.NotNull(empresaAtualizada);
        Assert.Equal(StorefrontCustomDomainStatus.Failed, empresaAtualizada!.DominioPersonalizadoStatus);
        Assert.Equal(StorefrontCustomDomainDnsStatus.Failed, empresaAtualizada.DominioPersonalizadoDnsStatus);
        Assert.Equal(StorefrontCustomDomainTlsStatus.NotStarted, empresaAtualizada.DominioPersonalizadoTlsStatus);
        Assert.Equal("O domínio ainda não aponta para o destino esperado.", empresaAtualizada.DominioPersonalizadoUltimaFalha);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoUltimaTentativaEm);
        Assert.Equal(agora.UtcDateTime.Add(retryDelay), empresaAtualizada.DominioPersonalizadoProximaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoAtivo);
        Assert.Null(empresaAtualizada.DominioPersonalizadoVerificadoEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoTlsProvisionamentoIniciadoEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoTlsUltimaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoTlsProximaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoHttpsProntoEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoAtivadoEm);
    }

    [Fact]
    public async Task ProcessPendingAsync_ShouldKeepDnsVerifiedAndRetryTlsWhenHttpsIsNotReady()
    {
        using var db = TestData.CreateDbContext();
        var empresa = new Empresa("Pet Center Vila");
        empresa.DefinirDominioPersonalizadoDesejado(
            "agenda.petcenter-vila.com",
            new DateTime(2026, 6, 27, 9, 0, 0, DateTimeKind.Utc));
        empresa.MarcarDominioPersonalizadoDnsVerificado(
            new DateTime(2026, 6, 27, 9, 10, 0, DateTimeKind.Utc),
            new DateTime(2026, 6, 27, 9, 10, 0, DateTimeKind.Utc));
        db.Empresas.Add(empresa);
        await db.SaveChangesAsync();

        var agora = new DateTimeOffset(2026, 6, 27, 9, 30, 0, TimeSpan.Zero);
        var retryDelay = TimeSpan.FromMinutes(15);
        var sut = new StorefrontDomainVerificationService(
            new EmpresaRepository(db),
            new FakeStorefrontDomainDnsVerificationService(new StorefrontDomainDnsVerificationResult
            {
                IsVerified = true,
                Message = "Domínio verificado com sucesso."
            }),
            new FakeStorefrontDomainCertificateReadinessService(new StorefrontDomainCertificateReadinessResult
            {
                IsReady = false,
                Message = "HTTPS ainda não está pronto para o domínio."
            }),
            Options.Create(new StorefrontDomainVerificationOptions
            {
                ExpectedTarget = "storefront.petcenter.local",
                RetryDelay = retryDelay,
                BatchSize = 10
            }),
            Options.Create(new StorefrontDomainCertificateReadinessOptions
            {
                ProbePath = "/",
                RetryDelay = retryDelay
            }),
            new ManualTimeProvider(agora));

        await sut.ProcessPendingAsync();

        var empresaAtualizada = await db.Empresas.FindAsync(empresa.Id);
        Assert.NotNull(empresaAtualizada);
        Assert.Equal(StorefrontCustomDomainStatus.TlsFailed, empresaAtualizada!.DominioPersonalizadoStatus);
        Assert.Equal(StorefrontCustomDomainDnsStatus.Verified, empresaAtualizada.DominioPersonalizadoDnsStatus);
        Assert.Equal(StorefrontCustomDomainTlsStatus.Failed, empresaAtualizada.DominioPersonalizadoTlsStatus);
        Assert.Equal(new DateTime(2026, 6, 27, 9, 10, 0, DateTimeKind.Utc), empresaAtualizada.DominioPersonalizadoVerificadoEm);
        Assert.Equal("HTTPS ainda não está pronto para o domínio.", empresaAtualizada.DominioPersonalizadoTlsUltimaFalha);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoTlsUltimaTentativaEm);
        Assert.Equal(agora.UtcDateTime.Add(retryDelay), empresaAtualizada.DominioPersonalizadoTlsProximaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoAtivo);
        Assert.Null(empresaAtualizada.DominioPersonalizadoHttpsProntoEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoAtivadoEm);
    }
}

internal class FakeStorefrontDomainDnsVerificationService : IStorefrontDomainDnsVerificationService
{
    private readonly StorefrontDomainDnsVerificationResult _result;

    public FakeStorefrontDomainDnsVerificationService(StorefrontDomainDnsVerificationResult result) => _result = result;

    public Task<StorefrontDomainDnsVerificationResult> VerifyAsync(string domain, CancellationToken cancellationToken = default) =>
        Task.FromResult(_result);
}

internal class FakeStorefrontDomainCertificateReadinessService : IStorefrontDomainCertificateReadinessService
{
    private readonly StorefrontDomainCertificateReadinessResult _result;

    public FakeStorefrontDomainCertificateReadinessService(StorefrontDomainCertificateReadinessResult result) =>
        _result = result;

    public Task<StorefrontDomainCertificateReadinessResult> CheckAsync(string domain, CancellationToken cancellationToken = default) =>
        Task.FromResult(_result);
}
