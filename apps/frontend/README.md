# petcenter frontend

Aplicação web do petcenter com fluxo público de reservas e o primeiro dashboard autenticado para operação do petshop.

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

### Sessão admin

- O dashboard em `/admin/*` autentica via `POST /auth/login`.
- O frontend salva `{ token, userId, empresaId }` em um cookie `httpOnly` seguro para manter o bearer token fora da URL e fora do JavaScript do navegador.
- Toda chamada autenticada do dashboard envia `Authorization: Bearer <token>` e depende do backend para aplicar o escopo da `Empresa`.

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

3. Rode o app:

```bash
npm run dev
```

4. Acesse `http://localhost:3000`.

## Credenciais de desenvolvimento do dashboard

O backend só cria um usuário administrativo se `Seed:AdminPassword` estiver configurada. Em desenvolvimento:

- e-mail padrão: `admin@petcenter.dev`
- empresa padrão: `Pet Center Dev`
- senha: definida por `Seed:AdminPassword` no backend

Se a seed não estiver configurada, crie um usuário pelo fluxo previsto do backend antes de usar `/admin/login`.

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
- `/bookings/[bookingId]/feedback` — feedback público vinculado à reserva

## Dashboard autenticado disponível

- `/admin/login` — entrada dedicada para operadores do petshop
- `/admin/bookings` — fila operacional com visão padrão de hoje + próximas reservas
- `/admin/bookings/[id]` — detalhe operacional com contexto completo e ações

### Comportamento da fila de reservas

- A visão padrão mostra reservas de hoje em diante ordenadas por data do horário.
- Filtros permitem revisar estado, intervalo de datas e profissional.
- Reservas rejeitadas continuam acessíveis pelo mesmo dashboard quando o estado e o período são ajustados.
- Conclusão, cancelamento e não comparecimento exigem confirmação explícita antes da mutação.

## Experiência de feedback público

- O backend de criação de reserva já retorna `bookingStatusAccessToken` e
  `feedbackAccessToken`.
- O frontend salva ambos em um cookie seguro por reserva para manter o status e
  o feedback disponíveis no mesmo navegador.
- A página `/bookings/[bookingId]/feedback` sempre consulta a elegibilidade
  antes de mostrar o formulário.
- O formulário envia nota para o profissional, nota para o petshop e comentário
  opcional.
- Quando o token não existe neste navegador, está inválido, a reserva ainda não
  está concluída ou o feedback já foi enviado, o fluxo mostra um estado
  explícito e orienta o retorno para o shell público.

## Observações

- A confirmação da reserva é assíncrona. O frontend nunca comunica confirmação imediata.
- O navegador preserva os tokens de status e feedback em cookie seguro por
  reserva para permitir reconsultas e continuidade no mesmo dispositivo.
- O CTA de feedback só aparece para reservas concluídas quando o
  `feedbackAccessToken` ainda está disponível no contexto salvo do navegador.
- O dashboard admin não replica nenhuma lógica de escopo por empresa no cliente; ele apenas propaga o JWT da sessão e depende do backend para garantir o isolamento multi-tenant.

## Validação sugerida

```bash
cd apps/frontend
npm run test
npm run build
```
