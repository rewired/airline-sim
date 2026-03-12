# ADR-0007: Dokumentations-Governance für Feature-PRs, ADR-Trigger und Ticket-Fortschrittsmatrix

## Status

Accepted

## Kontext

Die bestehenden Leitdokumente (`SEC.md`, `DD.md`, `TDD.md`) fordern bereits konsistente Dokumentation über `CHANGELOG.md` und ADRs. In der Praxis fehlte jedoch:

- eine verpflichtende, explizite `Docs Impact`-Sektion pro größerem Feature-PR,
- ein einheitliches, bereichsbasiertes Changelog-Format,
- klar definierte Trigger, wann Folge-ADRs zwingend anzulegen sind,
- eine sichtbar gepflegte Fortschrittsmatrix für den Ticket-Plan (T001–T060 und spätere T08x-Blöcke).

Ohne diese Governance-Regeln sinken Nachvollziehbarkeit, Entscheidungsqualität und Änderungs-Transparenz über mehrere Slices hinweg.

## Entscheidung

1. **Pflichtsektion in Major Feature PRs**
   - Jeder größere Feature-PR enthält die Sektion `Docs Impact`.
   - Dort werden zwei Entscheidungen explizit dokumentiert:
     - `CHANGELOG`: ja/nein + Begründung
     - `ADR`: ja/nein + Begründung

2. **Granulares Changelog nach Bereichen**
   - `docs/CHANGELOG.md` wird in Unreleased nach Domänenblöcken geführt:
     - `Web`
     - `Sim-Service`
     - `Domain/Packages`
     - `Docs`

3. **Verbindliche ADR-Trigger**
   - Folge-ADR ist verpflichtend, sobald Änderungen eine dieser Kategorien betreffen:
     - server-authoritative Grenzen / Trust Boundary,
     - Kern-Datenmodell (Entitäten, Relationen, Lebenszyklen),
     - Event-Architektur (Typen, Lifecycle, Propagationslogik).

4. **Sichtbare Ticket-Fortschrittsmatrix**
   - `docs/TDD.md` führt eine gepflegte Matrix für Ticketblöcke T001–T060.
   - Zusätzliche Zeilen für spätere T08x-Blöcke werden als Reserve sichtbar gehalten und bei Einführung konkretisiert.

## Konsequenzen

- PR-Reviews werden dokumentationsseitig reproduzierbar und auditierbar.
- Architekturänderungen werden weniger leicht „implizit“ übersehen, da ADR-Trigger explizit sind.
- Fortschritt auf Ticket-Ebene ist für Produkt-, Tech- und Delivery-Perspektive direkt sichtbar.
- Der Pflegeaufwand in Dokumentation steigt leicht, reduziert aber mittelfristig Abstimmungs- und Onboarding-Kosten.
