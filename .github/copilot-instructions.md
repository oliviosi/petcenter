# copilot-instructions.md — petcenter

This file is the master reference for all agents working in this repository. Read it fully before touching any code. Agent-specific artifacts are stored in dedicated folders: use `.claude/agents/` for Claude agents and `.github/agents/` for Copilot agents — load and execute only the instruction set that corresponds to the agent currently running; do not mix contents between the two folders. This file contains the domain, architecture, and cross-cutting rules that apply to all agents.

## Product

**petcenter** is a multi-tenant SaaS platform for petshop appointment scheduling, accessed via a public link — no app install required.

**Core user journey:**

1. A client opens the public link and browses petshops filtered by location, distance, ratings, species served, and services.
2. The client selects a petshop, picks a professional and a service, and requests an available time slot.
3. The booking request is queued via RabbitMQ to prevent overbooking; the client receives confirmation once the slot is secured.
4. At service completion, the professional may adjust the final price to reflect add-ons or discounts. Payment is collected in person — no online payment gateway.
5. After the appointment, the client may optionally rate the professional and the petshop.

**Tenant model:** A tenant is an **Empresa** (representing a petshop). All data is strictly scoped to the tenant. A user belongs to exactly one Empresa. There is no cross-tenant data access — ever.

**Admin panel:** Operational records (petshops, professionals, services, schedules, pets, owners, and configurations) are managed by authorized users in a dedicated admin panel.

```
petcenter/
        apps/
                backend/          ← .NET 10 Minimal API  (REST, auth, persistence)
                frontend/         ← Next.js 16 App Router (responsive web, public booking)
                mobile/           ← React Native + Expo (client-facing booking app)
                microservices/
                        rabbitmq/       ← RabbitMQ message broker (booking queue)
        openspec/           ← spec-driven change management
        .claude/
                agents/           ← specialist agent prompts (Claude)
        .github/
                agents/           ← specialist agent prompts (Copilot)
```

### Service communication map

```
[Client Browser / Mobile App]
        │  GET /petshops, GET /petshops/{id}/slots
        │  POST /bookings  (booking request)
        ▼
[.NET API — apps/backend]
        │  Publishes booking.requested → RabbitMQ
        ▼
[RabbitMQ — apps/microservices/rabbitmq]
        │  Resolves slot conflicts, emits booking.confirmed / booking.rejected
        ▼
[.NET API — persists booking, returns result to client]
        ▲
[Next.js Frontend — apps/frontend]
        │  All requests via JWT bearer token (authenticated flows)
        └──────────────────────────────────────────────────
```

**Rules:**

- The frontend **never** talks to RabbitMQ directly — all booking requests go through the .NET API.
- Booking confirmation is always async — never confirm a slot synchronously to the client.
- The .NET API is the single source of truth for availability; the queue enforces serialization.

---

## Tech stack

### Backend — apps/backend/Api/

| Concern          | Package / Version                                |
| ---------------- | ------------------------------------------------ |
| Runtime          | .NET 10                                          |
| API              | ASP.NET Core Minimal APIs                        |
| ORM              | EF Core 10                                       |
| Database         | PostgreSQL (Npgsql.EntityFrameworkCore 10)       |
| Validation       | FluentValidation 12                              |
| Auth             | Microsoft.AspNetCore.Authentication.JwtBearer 10 |
| Password hashing | BCrypt.Net-Next 4                                |
| API docs         | Swashbuckle.AspNetCore 10                        |
| Message queue    | RabbitMQ.Client 7                                |

### Frontend — apps/frontend/src/

| Concern   | Package / Version                                 |
| --------- | ------------------------------------------------- |
| Framework | Next.js 16 (App Router)                           |
| React     | 19                                                |
| Language  | TypeScript 5 (strict mode)                        |
| Styling   | Tailwind CSS v4 (`@tailwindcss/postcss`)          |
| Forms     | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Icons     | `lucide-react`                                    |
| Animation | `framer-motion`                                   |

### Mobile — apps/mobile/

| Concern    | Package / Version               |
| ---------- | ------------------------------- |
| Framework  | React Native 0.79 + Expo SDK 53 |
| Language   | TypeScript 5 (strict mode)      |
| Navigation | React Navigation 7              |
| State      | Zustand                         |
| Forms      | `react-hook-form` + `zod`       |
| Icons      | `lucide-react-native`           |

---

## Cross-service contracts

These contracts are frozen. **No agent may change them unilaterally.** Any change must be coordinated across all affected layers and proposed via OpenSpec.

### Booking queue contract

**Publisher:** .NET API → RabbitMQ exchange `bookings`

**`booking.requested` message:**

```json
{
  "bookingId": "uuid",
  "empresaId": "uuid",
  "professionalId": "uuid",
  "serviceId": "uuid",
  "clientId": "uuid",
  "requestedAt": "ISO-8601",
  "slotStart": "ISO-8601",
  "slotEnd": "ISO-8601"
}
```

**Consumer response events:** `booking.confirmed` | `booking.rejected`

Both events carry `bookingId`. On rejection, a `reason` string is included.

**Rule:** The .NET API must never mark a slot as confirmed before receiving `booking.confirmed` from the queue. On `booking.rejected`, the API returns a conflict error to the client.

### Frontend ↔ Backend auth contract

All authenticated requests carry a bearer token in `Authorization: Bearer <token>`. The .NET API validates the token and extracts the `EmpresaId` claim to scope all queries. Do not hardcode provider-specific SDKs or claim names in shared contracts.

---

## Language rules

These rules apply to every file in the monorepo, regardless of layer.

| Context                             | Language | Examples                                                              |
| ----------------------------------- | -------- | --------------------------------------------------------------------- |
| Domain entity names                 | pt-BR    | `Empresa`, `Pet`, `Profissional`, `Serviço`, `Agendamento`, `Horário` |
| Database table and column names     | pt-BR    | `empresas`, `pets`, `profissionais`, `agendamentos`, `criado_em`     |
| Error messages shown to users       | pt-BR    | `"Horário indisponível."`, `"Nome é obrigatório."`                    |
| API validation messages             | pt-BR    | `"Data de início é obrigatória."`                                     |
| UI labels, button text, page titles | pt-BR    | `"Agendar"`, `"Meus favoritos"`, `"Avaliar atendimento"`              |
| Code identifiers (all layers)       | English  | `CreateBookingService`, `ProfessionalRepository`, `useSlots`          |
| Technical suffixes                  | English  | `Service`, `Repository`, `Endpoint`, `Handler`                        |
| Code comments and docstrings        | English  | —                                                                     |
| API route paths                     | English  | `/bookings`, `/petshops`, `/professionals`, `/health`                 |
| Log messages (structured logs)      | English  | `"Booking conflict detected"`, `"Slot confirmed"`                     |

---

## Design system rules

Requirements, not suggestions. Every frontend component must follow them.

### Colors — use design tokens, never raw Tailwind palette classes

All semantic colors are declared as CSS custom properties in `src/app/globals.css` via `@theme inline` and mapped to Tailwind utility classes. Use the semantic token, never the raw palette class.

| Purpose            | Use This                                       | NOT This                                                |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------- |
| Primary text       | `text-text-primary`                            | `text-gray-900`, `text-gray-800`, `text-zinc-900`       |
| Secondary text     | `text-text-secondary`                          | `text-gray-600`, `text-gray-700`, `text-gray-500`       |
| Default border     | `border-border-default`                        | `border-gray-200`, `border-gray-100`, `border-zinc-200` |
| Strong border      | `border-border-strong`                         | `border-gray-300`                                       |
| Surface background | `bg-surface-secondary`                         | `bg-gray-50`, `bg-gray-100`, `bg-zinc-100`              |
| Error background   | `bg-error/10`                                  | `bg-red-50`, `bg-red-100`                               |
| Error text         | `text-error`                                   | `text-red-600`, `text-red-700`                          |
| Error border       | `border-error/20`                              | `border-red-200`                                        |
| Success background | `bg-success/10`                                | `bg-green-100`                                          |
| Success text       | `text-success`                                 | `text-green-700`, `text-green-600`                      |
| Category / badges  | `bg-primary/10 text-primary border-primary/20` | `bg-purple-50 text-purple-700 border-purple-100`        |

### Typography hierarchy

Never use more than two font sizes on the same card. Never bold text just to add visual weight — use size and color instead.

| Role              | Classes                                    |
| ----------------- | ------------------------------------------ |
| Page title        | `text-2xl font-semibold text-text-primary` |
| Section heading   | `text-lg font-semibold text-text-primary`  |
| Card title        | `text-sm font-medium text-text-primary`    |
| Body text         | `text-sm text-text-secondary`              |
| Meta / timestamps | `text-xs text-text-secondary`              |
| Form labels       | `text-sm font-medium text-text-primary`    |
| Error messages    | `text-xs text-error`                       |

### Spacing discipline

Default to `p-6` and `gap-6`. Reduce only when a layout constraint forces it. Never use arbitrary spacing values (`mt-[13px]`).

---

## Multi-tenancy rules

A bug here is a security incident.

1. Every database query that returns tenant data **must** filter by `EmpresaId`. No exceptions.
2. `EmpresaId` is always extracted from the validated JWT in the endpoint layer and passed explicitly through the request model into the service. Services never read from `HttpContext`.
3. No service may accept a caller-supplied `EmpresaId` from the request body — it must come from the token.
4. Cross-tenant joins are forbidden.

---

## Agent team & workflow

### Specialist agents

| Agent               | Owns                                                      |
| ------------------- | --------------------------------------------------------- |
| `cto`               | Orchestration, planning, OpenSpec, dispatch               |
| `backend-engineer`  | .NET API — modules, entities, repositories, services      |
| `frontend-engineer` | Next.js — pages, components, styling, forms               |
| `mobile-engineer`   | React Native + Expo — navigation, screens, native modules |

**Entry point:** Always start with the `cto` agent for any feature or significant change.

### OpenSpec workflow

```
opsx:explore  →  opsx:propose  →  [agent dispatch]  →  opsx:archive
```

1. **`opsx:explore`** — clarify requirements before committing to a spec.
2. **`opsx:propose`** — generate spec, design doc, and task list (tasks tagged `[backend]`, `[frontend]`, or `[mobile]`).
3. **Agent dispatch** — CTO briefs and dispatches specialists.
4. **`opsx:archive`** — close the change when all tasks are verified.

Skip OpenSpec only for bug fixes and changes touching ≤ 2 files.

---

## Global prohibitions

These apply to every agent, every layer, no exceptions.

- **NEVER** hardcode credentials, connection strings, or API keys — use environment variables.
- **NEVER** cross tenant boundaries in a query — every data access must be scoped to the authenticated `EmpresaId`.
- **NEVER** confirm a booking slot before receiving `booking.confirmed` from the queue.
- **NEVER** integrate an online payment gateway — payment is in-person only.
- **NEVER** add `try/catch` blocks to control business flow — throw typed domain exceptions and let the middleware handle HTTP mapping.
- **NEVER** expose internal implementation details across service boundaries.
- **NEVER** use raw Tailwind palette classes (`text-gray-900`, `bg-red-50`) on the frontend — always use the semantic design tokens from `globals.css`.
- **NEVER** write code comments that describe what the code does — only write comments when explaining a non-obvious constraint, workaround, or invariant.
- **NEVER** create a file in a `Shared/` folder on the backend — modules must be self-contained.
- **NEVER** commit `.env` files to git.
- **NEVER** skip the OpenSpec propose step for features that touch more than one service.
