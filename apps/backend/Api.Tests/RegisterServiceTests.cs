using System;
using System.Threading.Tasks;
using Api.Modules.Clients.Domain;
using Api.Modules.Clients.Infrastructure;
using Api.Modules.Clients.Routes.Register;
using Xunit;

namespace Api.Tests.Clients
{
    public class RegisterServiceTests
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

        [Fact]
        public async Task HandleAsync_CreatesNewClient_WhenEmailNotExists()
        {
            var repo = new InMemoryClienteRepo();
            var svc = new RegisterService(repo);

            var request = new RegisterRequest { Email = "new@example.com", Password = "P@ssw0rd", Nome = "João" };
            var id = await svc.HandleAsync(request);

            Assert.NotEqual(Guid.Empty, id);
            Assert.NotNull(repo.Stored);
            Assert.Equal(request.Email, repo.Stored.Email);
            Assert.Equal(request.Nome, repo.Stored.Nome);
        }

        [Fact]
        public async Task HandleAsync_Throws_WhenEmailAlreadyExists()
        {
            var repo = new InMemoryClienteRepo();
            repo.Stored = new Cliente("existing@example.com", BCrypt.Net.BCrypt.HashPassword("secret"), "Existing");

            var svc = new RegisterService(repo);
            var request = new RegisterRequest { Email = "existing@example.com", Password = "ignored", Nome = "X" };

            await Assert.ThrowsAsync<Api.Exceptions.ClientAlreadyExistsException>(() => svc.HandleAsync(request));
        }
    }
}
