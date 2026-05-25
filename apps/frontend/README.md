# petcenter frontend

Aplicação pública do fluxo de reservas do petcenter.

## Requisitos

- Node.js 22+
- API backend do repositório em execução

## Variáveis de ambiente

Crie `apps/frontend/.env.local`:

```bash
API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`API_BASE_URL` aponta para a API .NET.  
`NEXT_PUBLIC_APP_URL` é opcional e pode ser usado por integrações futuras.

## Executando localmente

1. Suba o backend:

```bash
dotnet run --project apps/backend/Api
```

2. Instale as dependências do frontend:

```bash
cd apps/frontend
npm install
```

3. Rode o app público:

```bash
npm run dev
```

4. Acesse `http://localhost:3000`.

## Comandos úteis

```bash
npm run dev
npm run build
npm run test
```

## Fluxo público disponível

- `/` — entrada pública com CTA para descoberta
- `/petshops` — catálogo público
- `/petshops/[slug]` — detalhe do petshop
- `/petshops/[slug]/book` — solicitação de reserva
- `/bookings/[bookingId]` — status público da reserva

## Observações

- A confirmação da reserva é assíncrona. O frontend nunca comunica confirmação imediata.
- O navegador preserva o token de consulta de status em cookie seguro por reserva para permitir reconsultas no mesmo dispositivo.
