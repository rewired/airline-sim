# ADR-0003: Kanonisches `FlightLegPlan`-Feldset und konsistenter Validation-Contract

## Status

Accepted

## Kontext

Zwischen Domain, Validation und sim-service gab es inkonsistente Feldnamen für dieselben Konzepte (`plannedTailId` vs. `assignedTailId`, lokale Zeiten vs. UTC-Aliase) sowie eine divergente Fehlerstruktur (`affectedLegIds` vs. `affectedLegs`). Dadurch waren Aufrufe typ-unsicher und führten zu MVP-Bypass-Mustern.

## Entscheidung

- `FlightLegPlan` in `packages/domain` ist die kanonische Single Source of Truth für Tail- und Zeitfelder.
- Validation-Regeln greifen ausschließlich auf die Domain-Felder zu (`plannedTailId`, `departureTimeLocal`, `arrivalTimeLocal`).
- Validation-Issues werden einheitlich mit `affectedLegIds` modelliert.
- sim-service validiert eingehende Schedules strikt über `FlightLegPlanSchema.array().safeParse(...)` und ruft `validateSchedule(...)` mit typkonsistenten Inputs auf.
- API-Contract wurde auf `affectedLegIds` vereinheitlicht.

## Konsequenzen

- Weniger Feld-Aliase und damit geringere Integrationsfehler zwischen Paketen.
- Klarere Erweiterbarkeit für weitere Schedule-Regeln.
- Konsistenteres DTO-/UI-Mapping für Validation-Issues.
