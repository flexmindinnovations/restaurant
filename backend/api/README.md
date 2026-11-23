# backend/api — DOSA API (planned)

**Status: not implemented.** This folder holds the plan only. No NestJS project, database schema,
business logic or infrastructure exists yet; that is deliberate for the bootstrap phase
([ARCHITECTURE.md D7](../../docs/ARCHITECTURE.md)). Nothing in the apps calls an API today.

## Stack (decided)

| Concern | Choice | Notes |
|---|---|---|
| Runtime | Node.js 22 LTS, TypeScript | Same toolchain as the monorepo |
| Framework | NestJS | Modules, DI, guards, pipes; first-class WebSocket gateways |
| Database | PostgreSQL 16+ | Relational core (orders, menu, tables, staff) |
| Data access | Decide at kickoff: Prisma or TypeORM / MikroORM | Must support migrations in CI |
| Realtime | NestJS WebSocket gateway (socket.io or `ws`) | Order lifecycle events to staff and customer apps |
| Contracts | OpenAPI generated from Nest decorators | Typed clients generated for Angular (TS) and Flutter (Dart) |
| Auth | Decide at kickoff | Staff roles (owner, manager, kitchen, server); guest sessions |

## Planned layout

```
backend/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/              guards, interceptors, pipes, error format
│   ├── config/              typed configuration, env validation
│   ├── modules/
│   │   ├── auth/            staff login, roles; guest session tokens
│   │   ├── restaurants/     restaurant and branch (branchId from day one)
│   │   ├── menu/            categories, items, modifiers, availability
│   │   ├── tables/          floor plan, table state
│   │   ├── orders/          order lifecycle (state machine below)
│   │   ├── kitchen/         tickets, timers, SLA, routing to stations
│   │   ├── payments/        provider adapter, receipts
│   │   ├── reservations/    bookings, availability
│   │   └── monitoring/      CCTV/device registry metadata (no video through the API)
│   └── realtime/            WebSocket gateway, rooms per branch / station / order
├── test/                    e2e tests (supertest + test database)
└── prisma/ or migrations/   schema and migrations
```

## Order lifecycle (shared with the design system)

The UI already defines the visual states (`color.order.*`, `DosaOrderStatus`, Lottie
`order-received`, `order-accepted`, `food-preparation`, `order-ready`). The API state machine uses
the same names so no mapping layer is needed:

```
received ──► accepted ──► preparing ──► ready ──► served
    │            │             │
    └────────────┴─────────────┴──► cancelled
delayed = a flag on accepted/preparing when the kitchen SLA is exceeded (not a separate state)
```

## Realtime events (draft)

| Event | Room | Payload (sketch) |
|---|---|---|
| `order.created` | `branch:{id}`, `station:{id}` | `{ orderId, branchId, tableId?, items[], createdAt }` |
| `order.status_changed` | `branch:{id}`, `order:{id}` | `{ orderId, from, to, at, by }` |
| `order.delayed` | `branch:{id}`, `station:{id}` | `{ orderId, minutesOver }` |
| `table.updated` | `branch:{id}` | `{ tableId, state }` |
| `payment.succeeded` | `order:{id}` | `{ orderId, amount, currency }` |

Clients treat events as hints and re-fetch the resource, so a missed event never leaves stale
state. Staff devices queue writes offline and flush on reconnect (the `sync-success` animation
marks that moment).

## Conventions to keep

- Every location-scoped record carries `branchId`, so multi-branch support is additive.
- Money as integer minor units plus ISO currency code; never floats.
- Timestamps in UTC (ISO 8601); the apps format in the restaurant's time zone.
- Errors use one shape: `{ code, message, details? }` with stable `code` strings for the apps.

## Starting the implementation (later phase)

1. `pnpm dlx @nestjs/cli new api --package-manager pnpm --skip-git` inside `backend/`.
2. Add `backend/api` to `pnpm-workspace.yaml`.
3. Add PostgreSQL via Docker Compose for local development and a CI service container.
4. Generate the OpenAPI document in CI and the TS / Dart clients from it.
