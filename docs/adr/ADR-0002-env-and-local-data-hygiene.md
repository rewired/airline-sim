# ADR-0002: `.env` und lokale Laufzeitdaten aus dem Repo halten

## Status
Accepted

## Kontext
Im Repository gab es Bedarf nach klaren, verbindlichen Regeln für Umgebungsdateien und lokale SQLite-Artefakte. Ziel ist, Secrets nicht zu versionieren und Laufzeitdaten sauber von Quellcode zu trennen.

## Entscheidung
- `.env`-Dateien werden niemals committed.
- Commitbar sind ausschließlich Vorlagen wie `.env.example` bzw. `.env.<name>.example`.
- Lokale Laufzeitdaten (z. B. `dev.db`) liegen unter `data/` statt in App-/Prisma-Quellordnern.
- Für `apps/sim-service` wird die DB auf `data/sim-service/dev.db` ausgerichtet (via `.env.example`).

## Konsequenzen
- Bessere Secret-Hygiene und geringeres Leckage-Risiko.
- Klarere Trennung zwischen Source of Truth (Code) und lokaler Runtime-State.
- Reproduzierbares Setup via `.env.example`-Template.
