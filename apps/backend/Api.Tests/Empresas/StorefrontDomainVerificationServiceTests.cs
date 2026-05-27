using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Tests.Support;
using Microsoft.Extensions.Options;

namespace Api.Tests.Empresas;

public class StorefrontDomainVerificationServiceTests
{
    [Fact]
    public async Task ProcessPendingAsync_ShouldActivateDesiredDomainWhenVerificationSucceeds()
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
            Options.Create(new StorefrontDomainVerificationOptions
            {
                ExpectedTarget = "storefront.petcenter.local",
                RetryDelay = TimeSpan.FromMinutes(15),
                BatchSize = 10
            }),
            new ManualTimeProvider(agora));

        await sut.ProcessPendingAsync();

        var empresaAtualizada = await db.Empresas.FindAsync(empresa.Id);
        Assert.NotNull(empresaAtualizada);
        Assert.Equal(StorefrontCustomDomainStatus.Active, empresaAtualizada!.DominioPersonalizadoStatus);
        Assert.Equal("agenda.petcenter-vila.com", empresaAtualizada.DominioPersonalizadoAtivo);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoUltimaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoProximaTentativaEm);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoVerificadoEm);
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
            Options.Create(new StorefrontDomainVerificationOptions
            {
                ExpectedTarget = "storefront.petcenter.local",
                RetryDelay = retryDelay,
                BatchSize = 10
            }),
            new ManualTimeProvider(agora));

        await sut.ProcessPendingAsync();

        var empresaAtualizada = await db.Empresas.FindAsync(empresa.Id);
        Assert.NotNull(empresaAtualizada);
        Assert.Equal(StorefrontCustomDomainStatus.Failed, empresaAtualizada!.DominioPersonalizadoStatus);
        Assert.Equal("O domínio ainda não aponta para o destino esperado.", empresaAtualizada.DominioPersonalizadoUltimaFalha);
        Assert.Equal(agora.UtcDateTime, empresaAtualizada.DominioPersonalizadoUltimaTentativaEm);
        Assert.Equal(agora.UtcDateTime.Add(retryDelay), empresaAtualizada.DominioPersonalizadoProximaTentativaEm);
        Assert.Null(empresaAtualizada.DominioPersonalizadoAtivo);
        Assert.Null(empresaAtualizada.DominioPersonalizadoVerificadoEm);
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
