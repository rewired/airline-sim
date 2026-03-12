# ADR-0004: Durchgängiger Flow Plan → Validate → Publish → Observe ohne Mock-Brüche

## Status

Accepted

## Kontext

Im MVP-Slice gab es mehrere Mock-Brüche zwischen den Kernschritten des Produkt-Loops:

- Schedule Publish nutzte eine aus `MOCK_LEGS` zusammengebaute Payload mit Platzhalterfeldern statt einer echten Draft-Struktur.
- Dashboard-Widgets für Hub-Health und Top/Bottom-Routen zeigten statische Daten.
- Der Network-Simulationsflow erzeugte keinen expliziten persistierbaren Command, sondern schrieb Route-Daten direkt ohne nachvollziehbaren Simulationskontext.
- Beim Publish im sim-service wurden Airports aus `routeId` nicht aufgelöst, sondern hartkodiert (`JFK/LHR`).

Das widerspricht den Leitplanken aus `SEC.md` (server-authoritative Command-Flows + validierte State-Changes).

## Entscheidung

- Schedule-UI modelliert Publish-Eingaben jetzt als Draft-Leg-Struktur mit `routeRef`, Zeiten und Tail-/Type-Zuordnung; die Publish-Payload wird daraus typisiert erzeugt.
- Network Planner persistiert Simulationsergebnisse als validierten `OpenRouteCommand` über `/api/routes/commands`; der Service wandelt den Command in Route-State um und gibt den akzeptierten Command-Kontext zurück.
- Dashboard-Hub- und Route-Insights werden über dedizierte API-Endpunkte geladen (`/api/dashboard/hub-health`, `/api/dashboard/route-performance`) und nicht mehr lokal statisch gerendert.
- ScheduleRepository löst `routeId` gegen gespeicherte Routes auf und verwendet deren `originAirportId`/`destinationAirportId` für erzeugte Flight Legs.

## Konsequenzen

- Der End-to-End-Loop ist konsistent: Planen im Network-/Schedule-UI erzeugt valide Commands/Plans, Publish schreibt routekonsistenten Ops-State, Observe nutzt API-basierte Daten.
- Geringere Fehlertoleranz gegenüber inkonsistenten Daten (fehlende Route-Auflösung führt deterministisch zu Fehler statt stillem Fallback).
- Bessere Nachvollziehbarkeit von Simulationsentscheidungen durch explizite Route-Commands.
