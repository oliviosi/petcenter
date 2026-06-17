# Fix binding for public slots endpoint

## Why

A requisição GET /petshops/{id}/slots está retornando 500 em dev porque o model binding exige a propriedade PetshopId no objeto GetPublicSlotsRequest e a binding a procura no query string (nome diferente: `id` na rota). Isso faz o pipeline lançar BadHttpRequestException antes do handler poder atribuir o id da rota ao request.PetshopId.

## What

Corrigir o binding para evitar o 500 tornando a propriedade PetshopId opcional no objeto de request (Guid?) e continuar atribuindo o valor do parâmetro de rota `id` dentro do handler. Isso evita que o model binder trate a ausência do campo como erro e preserva a validação via FluentValidation (NotEmpty continuará válida uma vez que o handler atribua o id antes da validação).

## Impact

- Backend: alteração pontual em Api/Modules/Bookings/Routes/GetSlots/Request.cs
- Tests: nenhum teste novo obrigatório, mas recomenda-se reexecutar build e smoke test.

## Scope

Pequena correção backend; não altera contratos públicos nem comportamento da API para consumidores.

## Ready-to-implement

Se aprovado, os passos necessários são triviais e seguros de aplicar no branch de correção.
