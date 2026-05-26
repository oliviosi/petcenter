# petcenter frontend

Aplicação web do petcenter com fluxo público de reservas e console autenticado do petshop para operação diária e setup de agenda.

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

- O console em `/admin/*` autentica via `POST /auth/login`.
- O frontend salva `{ token, userId, empresaId }` em um cookie `httpOnly` seguro para manter o bearer token fora da URL e fora do JavaScript do navegador.
- Toda chamada autenticada do console envia `Authorization: Bearer <token>` e depende do backend para aplicar o escopo da `Empresa`.

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

## Console admin autenticado disponível

- `/admin/login` — entrada dedicada para operadores do petshop
- `/admin/bookings` — fila operacional com visão padrão de hoje + próximas reservas
- `/admin/bookings/[id]` — detalhe operacional com contexto completo e ações
- `/admin/feedback` — console operacional de reputação com resumo do petshop, médias por profissional e lista filtrável de avaliações com atalho para a reserva
- `/admin/profile` — vitrine pública do petshop com slug, textos, cidade/bairro e estado de publicação
- `/admin/professionals` — cadastro, edição e ativação/desativação de profissionais
- `/admin/professionals/[id]` — hub operacional do profissional com perfil, serviços atribuídos e disponibilidade semanal
- `/admin/services` — catálogo operacional de serviços com duração, preço base e status ativo/inativo

### Setup de agenda no console

- O fluxo de setup foi centralizado no shell autenticado já usado para reservas.
- Profissionais e serviços reutilizam a mesma sessão JWT em cookie `httpOnly`; não existe lógica duplicada de escopo multi-tenant no cliente.
- O backend continua sendo a única fonte de verdade para o escopo da `Empresa`, para ativação/desativação e para validações de atribuição/disponibilidade.
- A página `/admin/professionals/[id]` concentra:
  - edição do perfil operacional
  - atribuição e remoção de serviços ativos
  - cadastro, edição e exclusão de janelas recorrentes de disponibilidade semanal
- A página `/admin/profile` concentra o perfil público usado pelo catálogo e pela página pública do petshop:
  - slug estável da loja
  - descrição, cidade e bairro usados na descoberta pública
  - resumos de contato e endereço exibidos na vitrine
  - estado guiado de publicação, com checklist dos campos obrigatórios
- Profissionais ou serviços inativos saem do fluxo operacional relevante:
  - profissionais inativos deixam de participar da vitrine pública
  - serviços inativos deixam de aparecer no catálogo público e nas opções de atribuição
- A primeira versão do setup mantém a disponibilidade simples: dia da semana + hora inicial + hora final.

### Comportamento da fila de reservas

- A visão padrão mostra reservas de hoje em diante ordenadas por data do horário.
- Filtros permitem revisar estado, intervalo de datas e profissional.
- Reservas rejeitadas continuam acessíveis pelo mesmo dashboard quando o estado e o período são ajustados.
- Conclusão, cancelamento e não comparecimento exigem confirmação explícita antes da mutação.

### Console de feedback no admin

- A página `/admin/feedback` consome apenas endpoints autenticados do tenant e nunca envia `empresaId` no cliente.
- O resumo destaca a reputação geral do petshop e a quebra por profissional com base em `BookingFeedback`.
- A lista filtrável por período e profissional ajuda a conectar comentários e notas de volta ao detalhe operacional em `/admin/bookings/[id]`.

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
- Publicar a vitrine em `/admin/profile` exige slug, descrição, cidade, bairro, resumo de contato e resumo de endereço válidos; conflitos de slug e erros de validação retornados pelo backend são exibidos diretamente no formulário.

## Validação sugerida

```bash
cd apps/frontend
npm run test
npm run build
```

Se o runner padrão do Vitest apresentar instabilidade no ambiente local, rode os testes em série com:

```bash
cd apps/frontend
npx vitest run --pool threads --maxWorkers=1
```
