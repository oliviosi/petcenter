using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Modules.Clients.Domain;
using Api.Modules.Clients.Infrastructure;
using Api.Modules.Clients.Routes.Login;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Api.Tests.Clients
{
    public class LoginServiceTests
    {
        private class InMemoryClienteRepo : IClienteRepository
        {
            public Cliente? Stored;
            public Task AddAsync(Cliente cliente)
            {
                Stored = cliente;
                return Task.CompletedTask;
            }

            public Task<Cliente?> GetByEmailAsync(string email)
            {
                return Task.FromResult(Stored != null && Stored.Email == email ? Stored : null);
            }

            public Task<Cliente?> GetByIdAsync(Guid id) => Task.FromResult(Stored != null && Stored.Id == id ? Stored : null);
        }

        private IConfiguration BuildConfiguration()
        {
            var dict = new Dictionary<string, string>
            {
                ["Jwt:Key"] = "test-secret-key-which-is-long-enough",
                ["Jwt:Issuer"] = "petcenter-test",
                ["Jwt:Audience"] = "petcenter-test-aud",
                ["Jwt:ExpiryMinutes"] = "60"
            };
            return new ConfigurationBuilder().AddInMemoryCollection(dict).Build();
        }

        [Fact]
        public async Task HandleAsync_ReturnsToken_WhenCredentialsValid()
        {
            var repo = new InMemoryClienteRepo();
            var senha = "S3cret!";
            var hash = BCrypt.Net.BCrypt.HashPassword(senha);
            var cliente = new Cliente("login@example.com", hash, "Cliente Teste");
            repo.Stored = cliente;

            var config = BuildConfiguration();
            var svc = new LoginService(repo, config);

            var request = new LoginRequest { Email = "login@example.com", Password = senha };
            var response = await svc.HandleAsync(request);

            Assert.NotNull(response);
            Assert.NotEmpty(response.Token);
            Assert.Equal(cliente.Id, response.ClientId);
        }

        [Fact]
        public async Task HandleAsync_Throws_WhenCredentialsInvalid()
        {
            var repo = new InMemoryClienteRepo();
            var senha = "CorrectPass";
            var hash = BCrypt.Net.BCrypt.HashPassword(senha);
            var cliente = new Cliente("login2@example.com", hash, "Cliente2");
            repo.Stored = cliente;

            var config = BuildConfiguration();
            var svc = new LoginService(repo, config);

            var request = new LoginRequest { Email = "login2@example.com", Password = "WrongPass" };
            await Assert.ThrowsAsync<InvalidOperationException>(() => svc.HandleAsync(request));
        }
    }
}
