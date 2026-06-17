using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Modules.Bookings.Routes.Create;
using Api.Modules.Empresas.Domain;
using Api.Modules.Empresas.Infrastructure;
using Api.Modules.Profissionais.Infrastructure;
using Api.Modules.Bookings.Infrastructure;
using Api.Modules.Profissionais.Domain;
using Api.Modules.Servicos.Infrastructure;
using Api.Modules.Bookings.Domain;
using Api.Modules.Bookings.Infrastructure.Availability;
using Xunit;

namespace Api.Tests.Bookings
{
    public class CreateBookingServiceAuthorizationTests
    {
        private class StubEmpresaRepo : IEmpresaRepository
        {
            private Empresa _empresa;
            public StubEmpresaRepo(Empresa empresa) => _empresa = empresa;
            public Task<Empresa?> GetByIdAsync(Guid id) => Task.FromResult<Empresa?>(null);
            public Task<Empresa?> GetPublicByIdAsync(Guid id) => Task.FromResult<Empresa?>(_empresa.Id == id ? _empresa : null);
            public Task<Empresa?> GetBySlugAsync(string slug) => Task.FromResult<Empresa?>(null);
            public Task<Empresa?> GetByCustomDomainAsync(string domain) => Task.FromResult<Empresa?>(null);
            public Task<Empresa?> GetPublicBySlugAsync(string slug) => Task.FromResult<Empresa?>(null);
            public Task<Empresa?> GetPublicByHostAsync(string host) => Task.FromResult<Empresa?>(null);
            public Task<List<Empresa>> ListEligibleForDomainAutomationAsync(DateTime referenciaUtc, int take = 100) => Task.FromResult(new List<Empresa>());
            public Task<List<Empresa>> ListPublicAsync(string? nome = null, string? cidade = null, string? bairro = null, string? servico = null) => Task.FromResult(new List<Empresa>());
            public Task<EmpresaPublicRatingSummary?> GetPublicRatingSummaryAsync(Guid empresaId) => Task.FromResult<EmpresaPublicRatingSummary?>(null);
            public Task<Dictionary<Guid, EmpresaPublicRatingSummary>> GetPublicRatingSummariesAsync(IEnumerable<Guid> empresaIds) => Task.FromResult(new Dictionary<Guid, EmpresaPublicRatingSummary>());
            public Task UpdateAsync(Empresa empresa) => Task.CompletedTask;
        }

        private class StubProfissionalRepo : IProfissionalRepository
        {
            private Profissional? _profissional;
            public StubProfissionalRepo(Profissional? profissional) => _profissional = profissional;
            public Task AddAsync(Profissional profissional) => Task.CompletedTask;
            public Task<Profissional?> GetByIdAsync(Guid id, Guid empresaId) => Task.FromResult<Profissional?>(_profissional != null && _profissional.Id == id && _profissional.EmpresaId == empresaId ? _profissional : null);
            public Task<List<Profissional>> ListByEmpresaAsync(Guid empresaId) => Task.FromResult(new List<Profissional>());
            public Task<List<Profissional>> ListAtivosByEmpresaAsync(Guid empresaId) => Task.FromResult(new List<Profissional>());
            public Task<List<Profissional>> ListByIdsAsync(Guid empresaId, IEnumerable<Guid> ids) => Task.FromResult(new List<Profissional>());
            public Task UpdateAsync(Profissional profissional) => Task.CompletedTask;
        }

        private class StubServicoRepo : IServicoRepository
        {
            public Task AddAsync(Api.Modules.Servicos.Domain.Servico servico) => Task.CompletedTask;
            public Task<Api.Modules.Servicos.Domain.Servico?> GetByIdAsync(Guid id, Guid empresaId) => Task.FromResult<Api.Modules.Servicos.Domain.Servico?>(new Api.Modules.Servicos.Domain.Servico("Serv", 30, 100));
            public Task<List<Api.Modules.Servicos.Domain.Servico>> ListByEmpresaAsync(Guid empresaId) => Task.FromResult(new List<Api.Modules.Servicos.Domain.Servico>());
            public Task UpdateAsync(Api.Modules.Servicos.Domain.Servico servico) => Task.CompletedTask;
        }

        private class StubAvailability : IBookingAvailabilityService
        {
            public Task<List<BookingAvailabilitySlot>> GetAvailableSlotsAsync(BookingAvailabilityQuery query) => Task.FromResult(new List<BookingAvailabilitySlot>());
        }

        private class StubBookingRepo : IBookingRepository
        {
            public Task AddAsync(Booking booking) => Task.CompletedTask;
            public Task<Booking?> GetByIdAsync(Guid id) => Task.FromResult<Booking?>(null);
            public Task UpdateAsync(Booking booking) => Task.CompletedTask;
            public Task<List<Booking>> ListByEmpresaAsync(Guid empresaId) => Task.FromResult(new List<Booking>());
        }

        private class StubEventPublisher : IBookingEventPublisher
        {
            public Task PublishRequestedAsync(BookingRequestedMessage message) => Task.CompletedTask;
        }

        private class StubTokenService : IBookingStatusAccessTokenService, IBookingFeedbackAccessTokenService
        {
            public string GenerateToken() => "tok";
            public string ProtectToken(string token) => token;
        }

        [Fact]
        public async Task HandleAsync_Throws_When_Profissional_Not_Found_For_Petshop()
        {
            var empresa = new Empresa("Test Petshop");
            var empresaId = empresa.Id;

            var empresaRepo = new StubEmpresaRepo(empresa);
            var profissionalRepo = new StubProfissionalRepo(null); // returns null -> not found
            var servicoRepo = new StubServicoRepo();
            var availability = new StubAvailability();
            var bookingRepo = new StubBookingRepo();
            var publisher = new StubEventPublisher();
            var tokenService = new StubTokenService();

            var svc = new CreateBookingService(
                empresaRepo,
                profissionalRepo,
                servicoRepo,
                availability,
                bookingRepo,
                publisher,
                tokenService,
                tokenService);

            var req = new CreateBookingRequest
            {
                PetshopId = empresaId,
                ProfessionalId = Guid.NewGuid(),
                ServiceId = Guid.NewGuid(),
                OwnerContact = "cliente@example.com",
                PetName = "Fido",
                PetSpecies = "Cachorro",
                SlotStart = DateTime.UtcNow,
                SlotEnd = DateTime.UtcNow.AddMinutes(30)
            };

            await Assert.ThrowsAsync<Api.Exceptions.ProfissionalNotFoundException>(() => svc.HandleAsync(req));
        }
    }
}
