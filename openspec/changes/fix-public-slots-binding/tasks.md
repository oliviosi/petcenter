1. Implementação

- [x] 1.1 Edit `apps/backend/Api/Modules/Bookings/Routes/GetSlots/Request.cs`: mudar `public Guid PetshopId { get; set; }` para `public Guid? PetshopId { get; set; }`.

- [x] 1.2 Garantir que `apps/backend/Api/Modules/Bookings/Routes/Endpoint.cs` continue atribuindo `request.PetshopId = id;` (já presente).

- [x] 1.3 Build e testes: `dotnet build` na pasta apps/backend/Api e executar qualquer suite de testes unitários/integrados disponíveis.

- [x] 1.4 Reexecutar o smoke: `apps/frontend\scripts\smoke-booking.ps1` apontando para o backend local.

- [x] 1.5 Criar PR descrevendo a razão e linkando este OpenSpec change.

2. Validação / QA

- [x] 2.1 Verificar manualmente GET /petshops/{id}/slots retorna 200 e lista de slots.
- [x] 2.2 Rodar front-end build + smoke booking conforme tarefa anterior.

3. Merge

- [x] 3.1 Merge após revisão e CI local OK.
