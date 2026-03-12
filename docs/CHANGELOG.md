# Changelog

## Unreleased

### Web

- Upgraded Schedule Builder UX to render clear cause→countermeasure chains in `ValidationPanel`, consume structured publish responses, and enforce a mandatory diff confirmation step before final publish.
- Extended ops recovery/swap APIs and web actions with impact metadata (OTP delta + estimated cost delta + summary) so operators can see light-weight operational effects.
- Closed the MVP mock gaps for the core loop: schedule publish now builds payloads from a draft-leg structure resolved to real `routeId`s, network simulation persists explicit route commands via `/api/routes/commands`, dashboard hub/route widgets read API-backed insight endpoints, and sim-service schedule publishing resolves airports from `routeId` instead of hardcoded `JFK/LHR`.

### Sim-Service

- Sim-service persistence was expanded with schedule lifecycle entities (`schedule_version`, `rotation`, `maintenance_window`, `ops_event`, `recovery_action`, `kpi_snapshot`) and repository abstractions per entity for explicit server-authoritative simulation state handling.
- Schedule publishing now creates and promotes explicit schedule versions with `Draft` → `Published` → `Archived` status transitions, persists rotations/flight legs against a version, and returns version metadata in publish responses.
- Game-loop persistence now records disruption `ops_event`s and periodic `kpi_snapshot`s, while ops recovery commands persist both an operational event and a linked recovery action.
- Fleet seeding now creates a realistic initial world state with routes, a published schedule version, rotations, weekly legs, maintenance windows, and a baseline KPI snapshot.
- Introduced explainable schedule publish contracts end-to-end: `/api/schedule/publish` now returns structured `{ errors, warnings, diffSummary }` payloads on both success and validation failure, and computes a publish diff summary (`addedLegs`, `removedLegs`, `movedLegs`, `tailChanges`) for mandatory pre-publish review.
- Harmonized schedule validation contracts: `FlightLegPlan` remains canonical for tail/time fields, validation now uses domain field names only, issue payloads are unified on `affectedLegIds`, and sim-service now performs typed schedule payload parsing before validation/publish.

### Domain/Packages

- Extended `@airline-sim/validation` rule outputs with machine-readable explainability fields per issue (`cause`, `affectedLegIds`, `recommendedAction`) and aligned tests/contracts to the richer structure.

### Docs

- Added ADR-0006 to document the shift to versioned schedule persistence and simulation observability records.
- Added ADR-0005 documenting the explainable validation + diff-gated publish + ops impact metadata decision.
- Added ADR-0007 documenting documentation governance: mandatory PR "Docs Impact" section, ADR trigger conditions, and ticket progress matrix policy.
- Added repository-wide hygiene rules for `.env` handling and local runtime data placement (`data/`), added `apps/sim-service/.env.example`, and moved sim-service SQLite `dev.db` out of `apps/sim-service/prisma` to `data/sim-service/`.
- Added an English root `README.md` with project overview, architecture principles, monorepo structure, setup instructions, commands, API overview, and documentation map.
- Documentation baseline from `docs/IDEAS.md` was structured into `AGENTS.md`, `SEC.md`, `DD.md`, `TDD.md`, and `VISION_SCOPE.md`.
- Document priority and documentation obligation (CHANGELOG/ADR) were explicitly defined.
- `docs/TDD.md` now includes a visible ticket progress matrix for T001–T060 plus reserved T08x extension slots.
