# TDD (Technical Design Document)
> Completeness rule: All details from `docs/IDEAS.md` remain binding; this document structures the content without extension.

## Design Principles
1. Decision depth instead of click volume.
2. Explainability.
3. Plan, publish, monitor, repair.
4. Browser-first means usability.
5. Depth in layers (network, rotation, ops, yield, maintenance, competition).

## Core Gameplay Loop
### Macro Loop
- Found an airline
- Select bases/hubs
- fleet build
- Develop network
- Optimize slots and frequencies
- Increase profitability
- Increase resilience
- against competition prevail

### Meso Loop
- demand analyze
- Open or close route
- Rotation build
- pricing strategy adjust
- Aircraft assign
- Maintenance schedule
- Monitor KPI effects

### Micro Loop (Ops)
- Delay detect
- Cause trace
- Check tail swap
- Deploy reserve aircraft
- Cancel or shift frequency
- Rescue hub bank
- customer damage minimize

## Game Flow / Time Model
No dull 24/7 real-time model with waiting.

### Simulation time in ticks
- The airline runs continuously
- The UI presents operations in understandable ops windows
- Players plan for a time horizon
- events arrive in compressed, playable pulses

### Two modes
#### Planning mode
- future edit
- What-if simulate
- Validate changes not yet published

#### Live mode
- Published plan runs
- Events arrive
- Recovery decisions required

## UX / Screen Architecture
### Main navigation
1. Dashboard
2. Network
3. Schedule
4. Operations
5. Fleet
6. Finance
7. Analytics
8. Admin / Settings

### Dashboard
Widgets:
- OTP
- Cashflow
- Profit today / week
- problematic Hubs
- open Alerts
- maintenance risks
- Top-/Flop-routes

### Network Planner
- map + side table
- demand view
- compare existing routes
- Simulate a new route
- Roughly test frequency and equipment
- hub feeder effect understand

### Schedule Builder
- Timeline/grid per tail, alternative flight table
- Drag/drop as complement
- Bulk edit
- copy week pattern
- template apply
- conflicts inline mark
- publish draft

### Ops Cockpit
- Live-Alert-Board
- Tail states
- Airport-/Hub-Status
- recommended Recovery-options

### Fleet
- Fleet overview
- Tails / types
- Health / maintenance windows
- deployment profile
- Reliability
- Leasing / ownership

### Finance & Yield
- Profit & Loss
- Route economics
- Forecast
- price adjustments
- Net contribution

### Analytics
- OTP-trends
- Delay-Causen
- Hub-Performance
- Aircraft utilization
- Maintenance burden
- profitability decomposition

## UX-Regeln
- No dialog madness
- Multi-select wherever it is logical
- Keyboard operation for power users
- Filter, gespeicherte Ansichten, Presets
- Every warning with justification
- Every metric with drilldown
- Bundle alerts, do not spam
- Show diffs before publishing

## Browser-Technik — Architektur
### Grundsatz
The browser is the workspace. The server is authoritative.

### Frontend
- Next.js as app shell
- React for UI workspaces
- TypeScript strikt
- Design system with data-heavy components

### Realtime
- WebSocket-Verbindung
- snapshot + delta updates
- Separate channels for state / alert / collaboration
- Client-side rate limiting and aggregation

### Lokale Berechnungen
In Web Workers:
- Draft-Validierung
- What-if-Recovery
- KPI-Vorschau
- Conflict analysis
- Temporary optimization runs

### Lokale Persistenz
IndexedDB for:
- Draft-Schedules
- lokale Snapshots
- Cache for reports
- UI-Layout / Filter / Presets
- Replays / Incident-Historie light

### Backend (Mindestverantwortungen)
- API / Command Layer
- Simulation Service
- Projection / Analytics Layer

### Persistenz
Relational core structure (e.g., PostgreSQL) with:
- airline
- airport
- route
- flight_leg
- schedule_version
- rotation
- aircraft_tail
- maintenance_window
- ops_event
- recovery_action
- kpi_snapshot

## MVP 0.1 — Concrete Screen Definition
### Dashboard
- KPI bar: Cash, Daily/weekly profit, OTP, Load factor, aktive Alerts, Critical tails
- Left column: Top 5 alerts, today’s disruptions, aircraft due for maintenance
- Center: Hub Health Overview, Delay Heatmap, Profit Trend
- Right column: top 5 profitable routes, bottom 5 routes, recommended actions
- Interactions: KPI→Drilldown, Alert→Ops, Bottom Route→Network, Tail→Fleet
- Not in MVP: freely configurable widgets, real-time collaboration

### Network Planner
- Left: Map as context
- Right: Table with route, demand score, distance, competition light, recommended frequency, profit forecast, hub/transfer contribution
- Actions: simulate new route, change frequency, test equipment suggestion, deactivate route, send route to schedule
- Core components: Airport selector, route candidate list, what-if drawer, economic breakdown panel
- UX rule: map is assistive, primary decision surface is on the right

### Schedule Builder
- Top: Version selector, draft/published, validation status, publish button
- Left: Tail list, filters by type/base/condition
- Center: Timeline/rotation grid per tail, legs as blocks, maintenance windows visible, conflicts marked inline
- Right: Inspector panel, selected leg/tail/rotation, warnings, KPI preview
- Actions: add leg, duplicate rotation, copy daily pattern, bulk shift, reassign tail, set maintenance window, validate draft, publish draft
- Validation Rules MVP: overlap conflict, turnaround too short, aircraft range exceeded, tail double-booked, maintenance collision, excessive daily utilization warning
- Output: published schedule version + change diff

### Ops Cockpit
- Left: Alert queue by priority, filters by hub/tail/severity
- Center: Active Incident Detail (Cause, Affected legs, Propagated follow-on effects, Time to escalation)
- Right: Recovery actions with cost/OTP/customer-impact preview + recommendation
- Bottom: Network impact strip (affected hubs, rotating tails, expected KPI damage)
- Recovery MVP: absorb delay, tail swap, cancel flight, reschedule flight, deploy reserve aircraft, defer maintenance with risk
- UX rule: before execution, plain-language consequences, cost estimate, KPI effect

## MVP 0.1 — User Flows
### Flow A — First profitable route
Network Planner → market selection → see demand/distance/profit → define frequency/type → send to Schedule Builder → create rotation → validate → publish → monitor in dashboard.

Success: player understands profitability.

### Flow B — Resolve tail conflict
Edit draft → conflict message → inspector shows cause → move leg/assign to another tail → validate again → conflict gone → publish.

Success: few interactions.

### Flow C — Rescue operational disruption
Incident occurs → alert in dashboard/ops → open incident → see causal chain → compare recovery options → execute action → see new forecast → observe remaining effects.

Success: meaningful, understandable decision.

### Flow D — Identify loss-making route
Negative route in dashboard → route breakdown → view demand/cost/load factor/OTP damage → switch to network planner → change frequency/equipment → create draft adjustment → publish.

Success: analysis → decision → implementation without context switching.

## Vertical Slice — Ticket Packages
### Package A — Foundations
Monorepo/app structure, UI shell, TS domain model, mock data layer, global state/query layer, design tokens/base components.

### Package B — Dashboard Slice
KPI cards, alert list, top/bottom routes, hub health, route drilldown.

### Package C — Network Planner Slice
airport selector, route candidate engine mock, economics panel, create route flow, handoff in draft schedule.

### Package D — Schedule Builder Slice
tail list, rotation timeline/grid, leg inspector, validation engine MVP, publish flow, diff view.

### Package E — Ops Cockpit Slice
alert queue, incident detail panel, recovery options, ops event generator mock, recovery apply flow, impact preview.

### Package F — Sim Core MVP
demand/economy tick, OTP/delay propagation light, maintenance degradation light, KPI snapshots, publish→live run.

## Technical Vertical Slice — Sequence
1. App Shell + Mock Domain
2. Dashboard read-only
3. Network Planner with route creation
4. Schedule Builder with draft state
5. Validation engine
6. Publish flow
7. Live simulation loop
8. Ops events + recovery
9. KPI analytics and drilldowns

## Repo/Monorepo Structure — Recommendation
Guiding decision: pnpm workspace monorepo, clear separation of apps/packages.

Root target state:
- apps/: web, sim-service, worker-sim, docs (optional later)
- packages/: domain, sim-core, ui, app-state, validation, analytics, api-contract, mocks, config-*
- tooling/, tests/, .github/
- Root: pnpm-workspace.yaml, turbo.json, package.json, tsconfig.base.json, README.md

### apps/web Responsibility
Next.js app shell, routing, auth light, core screens, WebSocket, worker orchestration, IndexedDB, user-facing UI.

### apps/sim-service Responsibility
Commands, schedule validation, publish→live, events, recovery, KPI snapshots, WebSocket state.

### apps/worker-sim Responsibility
time-based jobs, event generation, batch rebuilds, KPI re-aggregation, heavy computations.

## Technology Stack
Frontend: Next.js, React, TanStack Query, lokaler Client-State, Web Workers, IndexedDB.

Backend: Node.js/TypeScript, API + WebSocket gateway, authoritative sim layer, relational persistence.

Testing: Vitest (unit/package), Playwright (E2E).

## Package Dependencies — Rules
Erlaubt:
- apps/* konsumiert packages/*
- ui→domain
- sim-core→domain
- analytics→domain, sim-core
- api-contract→domain

Forbidden:
- domain importiert nichts aus UI/Apps
- sim-core does not depend on Next/Web
- ui has no backend dependencies

## Naming Conventions
Apps: @airline-sim/web, @airline-sim/sim-service, @airline-sim/worker-sim

Packages: @airline-sim/domain, @airline-sim/sim-core, @airline-sim/ui, @airline-sim/app-state, @airline-sim/validation, @airline-sim/analytics, @airline-sim/api-contract, @airline-sim/mocks

## Turbo Tasks — Target State
build/dev/lint/typecheck/test/e2e according to the idea-side schema.

## Root Scripts — Recommendation
dev/build/lint/typecheck/test/e2e/format via turbo run.

## Test Structure
Unit in packages/{sim-core,validation,analytics,domain};
Integration in tests/integration;
E2E in tests/e2e.

## What is intentionally not recommended
- everything only in apps/web
- sim core directly in React hooks
- validation only client-side
- cross-package relative import spaghetti
- microservices too early
- GraphQL as an end in itself

## Backlog — first 30 build tickets
Groups/tickets T001–T060 as described in IDEAS:
- Foundations (T001–T006)
- Domain & Contracts (T007–T012)
- Sim Core (T013–T018)
- Validation (T019–T024)
- Web App Shell (T025–T030)
- Dashboard Slice (T031–T035)
- Network Planner Slice (T036–T039)
- Schedule Builder Slice (T040–T045)
- Ops Cockpit Slice (T046–T050)
- Backend / Sim Service (T051–T055)
- Tests (T056–T060)
