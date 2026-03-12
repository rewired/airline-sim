# SEC (Security & Execution Constraints)
> Completeness rule: All details from `docs/IDEAS.md` remain binding; this document structures the content without extension.

## Document Priority
Docs win order: **SEC > DD > TDD > AGENTS > VISION**.

## Authoritative Simulation / Trust Boundary
- no critical game decision exclusively in the client
- the client may compute locally, but the server decides finally
- commands produce validated state changes
- browser is the workspace, server is authoritative

## Command and Validation Discipline
- schedule and command validation is mandatory
- explainable validation results must make causes transparent
- conflicts/warnings must be justified
- diffs before publication are mandatory

## Realtime Discipline
- WebSocket with snapshot + delta updates
- separate channels for state / alert / collaboration
- client-side rate limiting and aggregation
- bundle alerts instead of spam

## Persistence and Data Integrity
Relational core structure with the domain objects:
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

## Operational Risks and Countermeasures
### Too much simulation, too little game
Countermeasure:
- consistent player decision perspective
- abstract where details add no value

### Too much UI, too little clarity
Countermeasure:
- progressive disclosure
- saved views
- explain-why everywhere

### Too many events, just stress
Countermeasure:
- event throttling
- clustering
- prioritization
- recovery assist

### Poor scaling
Countermeasure:
- server-authoritative core model
- incremental projections
- Web Workers
- aggressive UI virtualization

## MVP Boundaries (Security/Complexity Control)
Not included in MVP 0.1:
- Multiplayer
- Alliances
- Cargo
- Detailed crew legality
- Complex slot negotiations
- Historical starting years
- Modding layer


## Repository Secret & Local Data Hygiene
- `.env` files are strictly local and must never be committed to Git.
- Only template files (`.env.example`, `.env.<name>.example`) may be tracked.
- Local runtime databases/artifacts (e.g., SQLite `dev.db`) must be stored under the repository `data/` directory, not inside app source folders.

## Documentation Requirement
- For every substantive change: update CHANGELOG.
- For every architecture or guiding decision change: create/continue an ADR.
