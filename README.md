# Airline Sim

Browser-first airline operations and network management simulation built as a TypeScript monorepo.

## What this project is

**Airline Sim** is an operations-focused management game prototype where players:
- plan a route network,
- build and validate schedules,
- publish operational plans,
- react to disruptions,
- and track business/operations KPIs.

The architecture follows a **server-authoritative** model: client-side workflows support planning and what-if analysis, while authoritative decisions and state changes happen in the backend service.

## Repository structure

This repository uses **pnpm workspaces** and **Turborepo**.

- `apps/web` – Next.js frontend for dashboard, network planning, schedule, fleet, and ops workflows.
- `apps/sim-service` – Express + WebSocket backend with Prisma/SQLite persistence.
- `packages/*` – shared domain logic and utilities (simulation core, validation, API contracts, analytics, app state, airport import tooling, shared TS/ESLint/Vitest configs).
- `docs` – product, domain, technical, security, ADR, and changelog documentation.

## Tech stack

- **Language:** TypeScript
- **Frontend:** Next.js, React, Tailwind CSS, TanStack Query, shadcn/Radix UI primitives
- **Backend:** Express, WebSocket (`ws`), Prisma
- **Database (local):** SQLite
- **Tooling:** pnpm workspaces, Turborepo, Vitest, Prettier

## Prerequisites

- Node.js 20+
- pnpm 9+

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Prepare environment (sim service):

```bash
cd apps/sim-service
cp .env.example .env
# DATABASE_URL is preconfigured to use the repository data directory:
# DATABASE_URL="file:../../../data/sim-service/dev.db"
pnpm prisma generate
pnpm prisma db push
pnpm tsx prisma/seed-fleet.ts
cd ../..
```

3. Start all apps in development mode:

```bash
pnpm dev
```

Typical local endpoints:
- Web app: `http://localhost:3000`
- Sim service: `http://localhost:4000`

## Common commands

From repository root:

```bash
pnpm dev         # run all dev tasks in parallel via turbo
pnpm build       # build all packages/apps
pnpm typecheck   # run TypeScript checks across workspace
pnpm lint        # run lint tasks
pnpm test        # run test tasks
pnpm e2e         # run end-to-end tasks (if configured)
pnpm format      # format TS/TSX/MD/JSON
```

## API overview (sim-service)

Current backend endpoints include:
- `GET /api/dashboard`
- `GET /api/ops/flights`
- `POST /api/ops/recover`
- `POST /api/ops/swap`
- `GET /api/routes`
- `POST /api/routes`
- `POST /api/schedule/publish`
- `GET /api/fleet`
- `POST /api/fleet/maintenance`
- WebSocket server for live flight status updates

## Documentation map

Core documentation lives in `docs/`:
- `SEC.md` – Security & execution constraints
- `DD.md` – Domain design
- `TDD.md` – Technical design
- `VISION_SCOPE.md` – Product vision and scope
- `CHANGELOG.md` – change history
- `adr/` – architecture decision records

Documentation priority is: **SEC > DD > TDD > AGENTS > VISION**.

## Contribution notes

- Local runtime data (e.g., SQLite DB files) lives under `data/` and is not committed.
- `.env` files are never committed; only `*.env.example` templates belong in Git.
- Keep the server-authoritative boundary intact.
- Preserve explainability in validation and operations decisions.
- Update `docs/CHANGELOG.md` for substantive changes.
- Add/update ADRs in `docs/adr/` for architecture or guiding decision changes.

## Project status

This is an MVP-oriented vertical slice in active iteration, focused on the core loop:

**plan → validate → publish → observe → repair → learn**
