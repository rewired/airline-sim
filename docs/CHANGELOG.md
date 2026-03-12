# Changelog

## Unreleased
- Added repository-wide hygiene rules for `.env` handling and local runtime data placement (`data/`), added `apps/sim-service/.env.example`, and moved sim-service SQLite `dev.db` out of `apps/sim-service/prisma` to `data/sim-service/`.
- Added an English root `README.md` with project overview, architecture principles, monorepo structure, setup instructions, commands, API overview, and documentation map.
- Documentation baseline from `docs/IDEAS.md` was structured into `AGENTS.md`, `SEC.md`, `DD.md`, `TDD.md`, and `VISION_SCOPE.md`.
- Document priority and documentation obligation (CHANGELOG/ADR) were explicitly defined.
