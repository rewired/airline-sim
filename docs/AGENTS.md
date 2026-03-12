# AGENTS.md
> Completeness rule: Details from `docs/IDEAS.md` apply in full; this file only supplements working rules for implementation.

## Scope
This file applies to the entire repository.

## Document Priority
In case of conflict, the following strictly applies:
1. `SEC.md`
2. `DD.md`
3. `TDD.md`
4. `AGENTS.md`
5. `VISION_SCOPE.md`

## Working Principles
- Focus on depth of decision-making instead of click volume.
- Always keep explainability in mind (why profitable/unprofitable, why delay cascade, why instability, etc.).
- Respect the core loop: plan, validate, publish, observe, repair, learn.
- Prioritize browser-first usability: tables, filters, bulk operations, responsiveness.
- Progressive disclosure: depth in layers (network, rotation, ops, yield, maintenance, competition).

## Architectural Guardrails
- The server is authoritative.
- No critical decisions purely client-side.
- Commands must produce validated state changes.
- Draft validation, what-if, and KPI preview may run locally; the server makes the final decision.

## Model and Feature Discipline
- Respect MVP 0.1 boundaries (no multiplayer, no alliances, no cargo, no crew legality details, no complex slot negotiations, no historical start years, no modding layer).
- For new tickets and implementations, respect the vertical slice sequence.
- Follow package dependency rules from `TDD.md`.

## Documentation Requirement (Binding)
- Always document changes.
- Update `CHANGELOG.md` with every substantive change.
- Create or continue ADRs (`docs/adr/*.md`) for architecture/guiding decisions.
