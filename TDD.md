# TDD (Technical Design Document)
> Vollständigkeitsregel: Alle Details aus `docs/IDEAS.md` bleiben verbindlich; dieses Dokument strukturiert die Inhalte ohne Erweiterung.

## Design-Prinzipien
1. Entscheidungstiefe statt Klickvolumen.
2. Explainability.
3. Planen, Veröffentlichen, Überwachen, Reparieren.
4. Browser-first heißt Bedienbarkeit.
5. Tiefe in Schichten (Netzwerk, Rotation, Ops, Yield, Wartung, Wettbewerb).

## Kern-Gameplay-Loop
### Makro-Loop
- Airline gründen
- Basen/Hubs auswählen
- Flotte aufbauen
- Netz entwickeln
- Slots und Frequenzen optimieren
- Profitabilität steigern
- Resilienz erhöhen
- gegen Konkurrenz bestehen

### Meso-Loop
- Nachfrage analysieren
- Route eröffnen oder schließen
- Rotation bauen
- Preisstrategie anpassen
- Aircraft zuweisen
- Maintenance einplanen
- KPI-Effekte beobachten

### Mikro-Loop (Ops)
- Delay erkennen
- Ursache nachvollziehen
- Tail swap prüfen
- Reservegerät einsetzen
- Frequenz streichen oder verschieben
- Hub-Bank retten
- Kundenschaden minimieren

## Spielfluss / Zeitmodell
Kein stumpfes 24/7-Echtzeitmodell mit Warterei.

### Simulationszeit in Takten
- Die Airline läuft kontinuierlich weiter
- Die UI präsentiert den Betrieb in verständlichen Ops-Fenstern
- Spieler planen für einen Zeithorizont
- Ereignisse kommen in verdichteten, spielbaren Pulsen an

### Zwei Modi
#### Planungsmodus
- Zukunft bearbeiten
- What-if simulieren
- noch nicht veröffentlichte Änderungen validieren

#### Live-Modus
- veröffentlichter Plan läuft
- Events treffen ein
- Recovery-Entscheidungen erforderlich

## UX / Screen-Architektur
### Hauptnavigation
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
- Profit heute / Woche
- problematische Hubs
- offene Alerts
- Wartungsrisiken
- Top-/Flop-Routen

### Network Planner
- Karte + Seitentabelle
- Nachfrage sehen
- bestehende Routen vergleichen
- neue Route simulieren
- Frequenz und Gerät grob testen
- Hub-Zubringer-Effekt verstehen

### Schedule Builder
- Timeline/Grid pro Tail, alternativ Flight-Table
- Drag/drop ergänzend
- Bulk edit
- copy week pattern
- template anwenden
- Konflikte inline markieren
- publish draft

### Ops Cockpit
- Live-Alert-Board
- Tail-Zustände
- Airport-/Hub-Status
- empfohlene Recovery-Optionen

### Fleet
- Flottenübersicht
- Tails / Muster
- Health / Wartungsfenster
- Einsatzprofil
- Zuverlässigkeit
- Leasing / Besitz

### Finance & Yield
- Profit & Loss
- Route economics
- Forecast
- Preisanpassungen
- Net contribution

### Analytics
- OTP-Trends
- Delay-Ursachen
- Hub-Performance
- Aircraft utilization
- Maintenance burden
- profitability decomposition

## UX-Regeln
- Kein Dialog-Wahnsinn
- Multi-Select überall dort, wo es logisch ist
- Tastaturbedienung für Power-User
- Filter, gespeicherte Ansichten, Presets
- jede Warnung mit Begründung
- jede Kennzahl mit Drilldown
- Alerts bündeln, nicht spammen
- Diffs vor Veröffentlichung zeigen

## Browser-Technik — Architektur
### Grundsatz
Der Browser ist die Arbeitsoberfläche. Der Server ist autoritativ.

### Frontend
- Next.js als App-Shell
- React für UI-Workspaces
- TypeScript strikt
- Design-System mit datenlastigen Komponenten

### Realtime
- WebSocket-Verbindung
- snapshot + delta updates
- getrennte Kanäle für state / alert / collaboration
- clientseitige Rate-Begrenzung und Zusammenfassung

### Lokale Berechnungen
In Web Workers:
- Draft-Validierung
- What-if-Recovery
- KPI-Vorschau
- Konfliktanalyse
- temporäre Optimierungsläufe

### Lokale Persistenz
IndexedDB für:
- Draft-Schedules
- lokale Snapshots
- Cache für Reports
- UI-Layout / Filter / Presets
- Replays / Incident-Historie light

### Backend (Mindestverantwortungen)
- API / Command Layer
- Simulation Service
- Projection / Analytics Layer

### Persistenz
Relationale Kernstruktur (z. B. PostgreSQL) mit:
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

## MVP 0.1 — konkrete Screen-Definition
### Dashboard
- KPI-Leiste: Cash, Tages-/Wochengewinn, OTP, Auslastung, aktive Alerts, kritische Tails
- Linke Spalte: Top 5 Alerts, heutige Störungen, wartungsfällige Aircraft
- Mitte: Hub Health Overview, Delay Heatmap, Profit Trend
- Rechte Spalte: Top 5 profitable routes, Bottom 5 routes, Handlungsempfehlungen
- Interaktionen: KPI→Drilldown, Alert→Ops, Bottom Route→Network, Tail→Fleet
- Nicht im MVP: frei konfigurierbare Widgets, Echtzeit-Collaboration

### Network Planner
- Links: Karte als Kontext
- Rechts: Tabelle mit Route, Nachfrage-Score, Distanz, Wettbewerb light, empfohlene Frequenz, Profit-Prognose, Hub-/Transfer-Beitrag
- Aktionen: neue Route simulieren, Frequenz ändern, Equipment-Vorschlag testen, Route stilllegen, Route an Schedule senden
- Kernkomponenten: Airport selector, route candidate list, what-if drawer, economic breakdown panel
- UX-Regel: Karte assistiv, primär ist die Entscheidungsfläche rechts

### Schedule Builder
- Oben: Version Selector, Draft/Published, Validierungsstatus, Publish Button
- Links: Tail List, Filter nach Muster/Basis/Zustand
- Mitte: Timeline/Rotation Grid pro Tail, Legs als Blöcke, Maintenance-Fenster sichtbar, Konflikte inline markiert
- Rechts: Inspector Panel, ausgewähltes Leg/Tail/Rotation, Warnungen, KPI-Vorschau
- Aktionen: Leg hinzufügen, Rotation duplizieren, Tagesmuster kopieren, Bulk-Verschiebung, Tail neu zuweisen, Maintenance-Fenster setzen, Draft validieren, Draft publizieren
- Validation Rules MVP: overlap conflict, turnaround too short, aircraft range exceeded, tail double-booked, maintenance collision, excessive daily utilization warning
- Output: publizierte Schedule-Version + Änderungsdiff

### Ops Cockpit
- Links: Alert Queue nach Priorität, Filter nach Hub/Tail/severity
- Mitte: Active Incident Detail (Ursache, betroffene Legs, propagierte Folgeeffekte, Zeit bis Eskalation)
- Rechts: Recovery Actions mit Kosten/OTP/Kundenimpact-Vorschau + recommendation
- Unten: Network Impact Strip (betroffene Hubs, rotierende Tails, erwartete KPI-Schäden)
- Recovery MVP: delay absorbieren, tail swap, Flug streichen, Flug verschieben, Reservegerät einsetzen, Maintenance verschieben mit Risiko
- UX-Regel: Vor Ausführung Klartext-Folgen, Kostenabschätzung, KPI-Effekt

## MVP 0.1 — User Flows
### Flow A — erste profitable Route
Network Planner → Marktwahl → Nachfrage/Distanz/Profit sehen → Frequenz/Muster festlegen → in Schedule Builder senden → Rotation erstellen → validieren → publizieren → im Dashboard beobachten.

Erfolg: Spieler versteht Profitabilität.

### Flow B — Tail-Konflikt beheben
Draft bearbeiten → Konflikt-Meldung → Inspector zeigt Ursache → Leg verschieben/anderen Tail zuweisen → erneut validieren → Konflikt weg → publizieren.

Erfolg: wenige Interaktionen.

### Flow C — operative Störung retten
Incident entsteht → Alert in Dashboard/Ops → Incident öffnen → Kausalkette sehen → Recovery vergleichen → Aktion ausführen → neue Prognose sehen → Restfolgen beobachten.

Erfolg: bedeutende, nachvollziehbare Entscheidung.

### Flow D — Verlustbringer identifizieren
Negative Route im Dashboard → Route Breakdown → Nachfrage/Kosten/Auslastung/OTP-Schaden sehen → in Network Planner wechseln → Frequenz/Gerät ändern → Draft-Anpassung erstellen → veröffentlichen.

Erfolg: Analyse → Entscheidung → Umsetzung ohne Medienbruch.

## Vertical Slice — Ticketpakete
### Paket A — Foundations
Monorepo/App-Struktur, UI shell, TS domain model, Mock data layer, global state/query layer, design tokens/base components.

### Paket B — Dashboard Slice
KPI cards, alert list, top/bottom routes, hub health, route drilldown.

### Paket C — Network Planner Slice
airport selector, route candidate engine mock, economics panel, create route flow, handoff in draft schedule.

### Paket D — Schedule Builder Slice
tail list, rotation timeline/grid, leg inspector, validation engine MVP, publish flow, diff view.

### Paket E — Ops Cockpit Slice
alert queue, incident detail panel, recovery options, ops event generator mock, recovery apply flow, impact preview.

### Paket F — Sim Core MVP
demand/economy tick, OTP/delay propagation light, maintenance degradation light, KPI snapshots, publish→live run.

## Technischer Vertical Slice — Reihenfolge
1. App Shell + Mock Domain
2. Dashboard read-only
3. Network Planner with route creation
4. Schedule Builder with draft state
5. Validation engine
6. Publish flow
7. Live simulation loop
8. Ops events + recovery
9. KPI analytics and drilldowns

## Repo-/Monorepo-Struktur — Empfehlung
Leitentscheidung: pnpm-Workspace-Monorepo, klare Trennung Apps/Packages.

Root-Zielbild:
- apps/: web, sim-service, worker-sim, docs (optional später)
- packages/: domain, sim-core, ui, app-state, validation, analytics, api-contract, mocks, config-*
- tooling/, tests/, .github/
- Root: pnpm-workspace.yaml, turbo.json, package.json, tsconfig.base.json, README.md

### apps/web Verantwortung
Next.js App-Shell, Routing, Auth light, Kernscreens, WebSocket, Worker-Orchestrierung, IndexedDB, user-facing UI.

### apps/sim-service Verantwortung
Commands, Schedule validieren, publish→live, Events, Recovery, KPI-Snapshots, WebSocket-State.

### apps/worker-sim Verantwortung
zeitbasierte Jobs, Event-Generierung, Batch-Rebuilds, KPI-Reaggregation, schwere Berechnungen.

## Technologie-Zuschnitt
Frontend: Next.js, React, TanStack Query, lokaler Client-State, Web Workers, IndexedDB.

Backend: Node.js/TypeScript, API + WebSocket Gateway, autoritativer Sim-Layer, relationale Persistenz.

Testen: Vitest (Unit/Package), Playwright (E2E).

## Package-Abhängigkeiten — Regeln
Erlaubt:
- apps/* konsumiert packages/*
- ui→domain
- sim-core→domain
- analytics→domain, sim-core
- api-contract→domain

Verboten:
- domain importiert nichts aus UI/Apps
- sim-core hängt nicht von Next/Web ab
- ui hat keine Backend-Abhängigkeiten

## Naming-Konventionen
Apps: @airline-sim/web, @airline-sim/sim-service, @airline-sim/worker-sim

Packages: @airline-sim/domain, @airline-sim/sim-core, @airline-sim/ui, @airline-sim/app-state, @airline-sim/validation, @airline-sim/analytics, @airline-sim/api-contract, @airline-sim/mocks

## Turbo Tasks — Zielbild
build/dev/lint/typecheck/test/e2e gemäß ideenseitigem Schema.

## Root Scripts — Empfehlung
dev/build/lint/typecheck/test/e2e/format via turbo run.

## Test-Struktur
Unit in packages/{sim-core,validation,analytics,domain};
Integration in tests/integration;
E2E in tests/e2e.

## Was bewusst nicht empfohlen wird
- alles nur in apps/web
- Sim-Core direkt in React Hooks
- Validierung nur clientseitig
- packageübergreifende relative Import-Suppe
- zu frühe Microservices
- GraphQL als Selbstzweck

## Backlog — erste 30 Build-Tickets
Gruppen/Tickets T001–T060 wie in IDEAS beschrieben:
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
