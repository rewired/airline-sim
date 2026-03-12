# Browserbasierte Airline-Simulation — Blueprint (Midcore → Hardcore)

## 1. Produktthese

Die Simulation ist **kein Casual-Tycoon** und **kein B2B-Tool**, sondern ein browserbasiertes **Airline-Ops- und Network-Management-Spiel** für Spieler, die echte operative Tiefe wollen, ohne in regulatorischem Mikromanagement zu ersticken.

Der Kernnutzen lautet:

> Plane ein Airline-Netz, betreibe es unter realistischen Zwängen und rette den Betrieb, wenn die Realität dir in die Turbinen greift.

Das Spiel muss sich anfühlen wie eine Mischung aus:

* Netzwerkplanung
* Rotationsbau
* operativer Leitstelle
* wirtschaftlicher Steuerung
* Krisenmanagement

Nicht wie:

* Wartezeit-Simulator
* Excel mit Jetfuel-Theme
* Clicker mit Flugzeugen

---

## 2. Zielgruppe

### Primärzielgruppe

* Midcore- bis Hardcore-Spieler
* Tycoon-/Management-Spieler
* Airline-/Flight-Sim-Enthusiasten
* Spieler mit Spaß an Systemoptimierung, Störungen, Recovery, KPIs

### Nicht-Zielgruppe

* reine Mobile-F2P-Wartezeitspieler
* Spieler, die primär 3D-Flugzeuge fliegen wollen
* Spieler, die maximale Regeltreue bis ins letzte Crew-Rest-Detail verlangen

---

## 3. Design-Prinzipien

### 3.1 Entscheidungstiefe statt Klickvolumen

Jede zusätzliche Komplexität muss zu besseren oder schwierigeren Entscheidungen führen. Keine Pflichtklicks ohne Erkenntnisgewinn.

### 3.2 Explainability

Das Spiel muss jederzeit erklären können:

* warum eine Route profitabel oder unprofitabel ist
* warum eine Rotation instabil ist
* warum ein Delay kaskadiert
* warum Paxe abwandern
* warum Wartung zu Problemen führt

### 3.3 Planen, Veröffentlichen, Überwachen, Reparieren

Der Kernloop ist nicht "bauen und zugucken", sondern:

1. planen
2. validieren
3. veröffentlichen
4. Betrieb beobachten
5. Störungen abfangen
6. lernen und optimieren

### 3.4 Browser-first heißt Bedienbarkeit

Stark tabellarische, filterbare, batch-fähige UI. Keine Designentscheidung darf zulasten von Übersicht, Bulk-Operationen und Reaktionsgeschwindigkeit gehen.

### 3.5 Tiefe in Schichten

Das Spiel startet verständlich und öffnet dann weitere Ebenen:

* Netzwerk
* Rotation
* Ops
* Yield
* Wartung
* Wettbewerb

---

## 4. Kernfantasie

Die Spielerfantasie lautet nicht einfach:

> Ich besitze eine Airline.

Sondern:

> Ich halte eine komplexe Airline mit knappen Ressourcen unter Druck stabil und profitabel.

Das unterscheidet das Spiel von klassischen Airline-Tycoons.

---

## 5. Kern-Gameplay-Loop

## 5.1 Makro-Loop

* Airline gründen
* Basen/Hubs auswählen
* Flotte aufbauen
* Netz entwickeln
* Slots und Frequenzen optimieren
* Profitabilität steigern
* Resilienz erhöhen
* gegen Konkurrenz bestehen

## 5.2 Meso-Loop

* Nachfrage analysieren
* Route eröffnen oder schließen
* Rotation bauen
* Preisstrategie anpassen
* Aircraft zuweisen
* Maintenance einplanen
* KPI-Effekte beobachten

## 5.3 Mikro-Loop (Ops)

* Delay erkennen
* Ursache nachvollziehen
* Tail swap prüfen
* Reservegerät einsetzen
* Frequenz streichen oder verschieben
* Hub-Bank retten
* Kundenschaden minimieren

---

## 6. Kernsysteme

## 6.1 Airline-Struktur

* Airline
* Markenprofil / Positionierung
* Basisflughäfen
* Hubs
* Flotte
* Cash / Schulden / Leasing
* Reputation
* Betriebsstabilität

## 6.2 Flughäfen

Pro Flughafen mindestens:

* Größe / Nachfragegewicht
* O&D-Nachfrageprofile
* Slot-Druck
* Gebührenniveau
* Ground-Turn-Effizienz
* Wetter-/Störungsneigung
* Transferqualität
* Curfew / Restriktionen light

## 6.3 Flugzeuge

Pro Muster / Tail:

* Sitzkapazität
* Reichweite
* Turnaround-Minimum
* Kostenprofil
* Wartungszustand
* Zuverlässigkeit
* Eignung für Kurz-/Mittel-/Langstrecke
* Tail-spezifische Historie

Abstraktion für MVP:

* Start mit vereinfachten Tail-individuellen Daten
* später detailliertere Zuverlässigkeit, Alterung, Check-Intervalle

## 6.4 Nachfrage und Wirtschaft

Systeme:

* O&D-Nachfrage
* Transferverkehr über Hubs
* Nachfrage-Saisonalität
* Preiselastizität light
* Service-/Markenbonus light
* Konkurrenzdruck

Kosten:

* Fixkosten
* Leasing / Finanzierung
* Treibstoff abstrahiert
* Flughafengebühren
* Wartungskosten
* Crewkosten auf Pool-Ebene
* Verspätungs-/Stornokosten

Kennzahlen:

* Profit pro Route
* Profit pro Rotation
* Auslastung
* Yield
* RASK / CASK light
* OTP
* Irregularity Cost
* Hub Integrity

## 6.5 Scheduling / Rotation

Das Herzstück.

Funktionen:

* Flugplan auf Wochenbasis
* Rotationsbau pro Tail
* Vorlagen / Templates
* Wiederkehrende Frequenzen
* Wellen / Banks an Hubs
* Mindestpuffer / Turnaround
* Maintenance-Slots
* Konfliktprüfung

Validierung:

* Überschneidungen
* unrealistische Bodenzeiten
* Reichweitenverletzungen
* Wartungskollisionen
* Hub-Risiken
* Übernutzung einzelner Tails

## 6.6 Operations / IRROPS

Dies ist der Differenzierer.

Eventtypen:

* Wetter
* Tail technical issue
* verspätete Vorrotation
* reduzierte Flughafen-Kapazität
* Maintenance overrun
* Personalmangel als Pool-Event

Spieleraktionen:

* Tail swap
* Delay absorbieren
* Flug streichen
* Frequenz zusammenlegen
* Ersatzgerät aktivieren
* Maintenance verschieben mit Risiko

## 6.7 Wartung

Für MVP bewusst nicht zu tief.

MVP:

* Health-Zustand je Tail
* planned maintenance windows
* reliability penalty bei Vernachlässigung
* höhere AOG-/Delay-Wahrscheinlichkeit

Später:

* A-check-artige Zyklen
* Flottenalterung
* Ersatzteil-/Kapazitätsdruck abstrahiert

## 6.8 Crew

Nicht als vollregulatorische Crew-Simulation starten.

MVP:

* Crew-Pools je Basis / Flottengruppe
* Kapazität und Verfügbarkeit
* Engpass-Effekt auf Recovery und Planbarkeit

Später optional:

* duty legality light
* Repositioning
* Reserve-Crew-Strategie

## 6.9 Wettbewerb

MVP zunächst Solo-Welt oder isolierte Shards.

Später:

* KI-Airlines oder Shared World
* Konkurrenz auf Strecken
* Yield-Druck
* Hub-Kämpfe
* Slot-Knappheit

---

## 7. Spielfluss / Zeitmodell

Kein stumpfes 24/7-Echtzeitmodell mit Warterei.

Empfohlenes Modell:

### Simulationszeit in Takten

* Die Airline läuft kontinuierlich weiter
* Die UI präsentiert den Betrieb in verständlichen Ops-Fenstern
* Spieler planen für einen Zeithorizont
* Ereignisse kommen in verdichteten, spielbaren Pulsen an

### Zwei Modi

#### Planungsmodus

* Zukunft bearbeiten
* What-if simulieren
* noch nicht veröffentlichte Änderungen validieren

#### Live-Modus

* veröffentlichter Plan läuft
* Events treffen ein
* Recovery-Entscheidungen erforderlich

Das vermeidet sowohl Leerlauf als auch hektische Daueralarmierung.

---

## 8. UX / Screen-Architektur

## 8.1 Hauptnavigation

1. Dashboard
2. Network
3. Schedule
4. Operations
5. Fleet
6. Finance
7. Analytics
8. Admin / Settings

## 8.2 Dashboard

Zweck:

* Überblick über Zustand der Airline

Widgets:

* OTP
* Cashflow
* Profit heute / Woche
* problematische Hubs
* offene Alerts
* Wartungsrisiken
* Top-/Flop-Routen

## 8.3 Network Planner

Ansicht:

* Karte + Seitentabelle

Funktionen:

* Nachfrage sehen
* bestehende Routen vergleichen
* neue Route simulieren
* Frequenz und Gerät grob testen
* Hub-Zubringer-Effekt verstehen

## 8.4 Schedule Builder

Ansicht:

* Timeline/Grid pro Tail
* alternativ Flight-Table

Funktionen:

* Drag/drop nur ergänzend, nicht exklusiv
* Bulk edit
* copy week pattern
* template anwenden
* Konflikte inline markieren
* publish draft

## 8.5 Ops Cockpit

Ansicht:

* Live-Alert-Board
* Tail-Zustände
* Airport-/Hub-Status
* empfohlene Recovery-Optionen

Ziel:

* Probleme erkennen
* Ursache verstehen
* Auswirkungen abschätzen
* schnell entscheiden

## 8.6 Fleet

* Flottenübersicht
* Tails / Muster
* Health / Wartungsfenster
* Einsatzprofil
* Zuverlässigkeit
* Leasing / Besitz

## 8.7 Finance & Yield

* Profit & Loss
* Route economics
* Forecast
* Preisanpassungen
* Net contribution

## 8.8 Analytics

* OTP-Trends
* Delay-Ursachen
* Hub-Performance
* Aircraft utilization
* Maintenance burden
* profitability decomposition

---

## 9. UX-Regeln

* Kein Dialog-Wahnsinn
* Multi-Select überall dort, wo es logisch ist
* Tastaturbedienung für Power-User
* Filter, gespeicherte Ansichten, Presets
* jede Warnung mit Begründung
* jede Kennzahl mit Drilldown
* Alerts bündeln, nicht spammen
* Diffs vor Veröffentlichung zeigen

---

## 10. Browser-Technik — Architektur

## 10.1 Grundsatz

Der Browser ist die Arbeitsoberfläche.
Der Server ist autoritativ.

## 10.2 Frontend

Empfohlen:

* Next.js als App-Shell
* React für UI-Workspaces
* TypeScript strikt
* Design-System mit datenlastigen Komponenten

## 10.3 Realtime

* WebSocket-Verbindung
* snapshot + delta updates
* getrennte Kanäle für state / alert / collaboration
* clientseitige Rate-Begrenzung und Zusammenfassung

## 10.4 Lokale Berechnungen

In Web Workers:

* Draft-Validierung
* What-if-Recovery
* KPI-Vorschau
* Konfliktanalyse
* temporäre Optimierungsläufe

## 10.5 Lokale Persistenz

IndexedDB für:

* Draft-Schedules
* lokale Snapshots
* Cache für Reports
* UI-Layout / Filter / Presets
* Replays / Incident-Historie light

## 10.6 Backend

Mindestens drei Verantwortungen:

* API / Command Layer
* Simulation Service
* Projection / Analytics Layer

## 10.7 Persistenz

Relationale Kernstruktur, z. B. PostgreSQL.

Domänenobjekte:

* airline
* airport
* route
* flight_leg
* schedule_version
* rotation
* aircraft_tail
* maintenance_window
* ops_event
* recovery_action
* kpi_snapshot

## 10.8 Autoritative Sim

Wichtig:

* keine kritische Spielentscheidung ausschließlich im Client
* Client darf lokal rechnen, aber Server entscheidet final
* Commands erzeugen validierte Zustandsänderungen

---

## 11. Datenmodell — grob

## 11.1 Entities

### Airline

* id
* name
* cash
* reputation
* brand_profile
* created_at

### Airport

* id
* iata
* name
* demand_profile
* slot_profile
* weather_profile
* fee_profile

### AircraftType

* id
* code
* seats_default
* range_km
* turnaround_min
* operating_cost_profile
* reliability_base

### AircraftTail

* id
* type_id
* airline_id
* base_airport_id
* health
* age_factor
* maintenance_due_state
* status

### Route

* id
* airline_id
* origin_airport_id
* destination_airport_id
* market_score
* competition_score
* strategy_role

### FlightLegTemplate

* id
* route_id
* day_of_week
* dep_time
* arr_time
* aircraft_type_constraint

### Rotation

* id
* tail_id
* schedule_version_id
* sequence_index

### OpsEvent

* id
* type
* severity
* timestamp
* affected_tail_id
* affected_airport_id
* impact_payload

### RecoveryDecision

* id
* event_id
* decision_type
* cost_delta
* otp_delta
* customer_impact_delta

---

## 12. Spielmodi

## 12.1 Single-Airline Career

* Fokusmodus
* ideal für Start und MVP

## 12.2 Shared World / Async Competition

* später
* mehrere Airlines im selben Markt
* Wettbewerb um Nachfrage / Slots / Reputation

## 12.3 Scenario Mode

* vordefinierte Starts
* low-cost carrier
* legacy hub carrier
* Inselhüpfer
* Krisenszenario mit Wetter / Maintenance / knappen Slots

---

## 13. Monetarisierung

Empfohlen:

* Premium Buy-to-Play oder Premium + Expansions
* kein Pay-to-Skip
* kein Energie-/Wartezeitmodell
* kosmetische oder Content-DLCs möglich

Für dieses Segment ist Vertrauen wichtiger als kurzfristige IAP-Reibung.

---

## 14. MVP-Scope

## MVP 0.1 — vertikaler Schnitt

### Enthalten

* eine Airline
* private Welt
* 30–80 Flughäfen
* 4–6 Flugzeugmuster
* Route planning basic
* Rotation builder
* schedule validation
* profitability model basic
* maintenance light
* operations events basic
* recovery actions basic
* dashboard + analytics basic

### Nicht enthalten

* Multiplayer
* Allianzen
* Cargo
* detaillierte Crew-Legality
* komplexe Slotverhandlungen
* historische Startjahre
* Modding-Schicht

## MVP-Erfolgskriterien

* 1 Woche Flugplan spielbar ohne UI-Frust
* Delay-Ketten nachvollziehbar
* mindestens 3 sinnvolle Recovery-Optionen pro Störungsklasse
* Spieler versteht, warum seine Airline Geld verliert
* kein kollabierendes UI bei 200+ Legs

---

## 15. Roadmap

## Phase 1 — Core

* Airline- und Flughafendatenmodell
* Demand/Economy light
* Flotte
* Rotation Builder
* Publish/Versioning

## Phase 2 — Ops

* Event Engine
* Delay propagation
* Tail swaps
* Maintenance windows
* Alert Center

## Phase 3 — Insight

* KPI decomposition
* Explain-Why Panels
* Heatmaps / Hub diagnostics
* Forecasting

## Phase 4 — Wettbewerb

* KI-Airlines oder Shared World
* Yield pressure
* Reputation races
* slot scarcity

## Phase 5 — Ecosystem

* scenarios
* replay system
* import/export
* modding hooks

---

## 16. Kritische Risiken

### 16.1 Zu viel Sim, zu wenig Spiel

Gegenmaßnahme:

* Konsequente Spielerentscheidungs-Perspektive
* abstrahieren, wo Details nichts bringen

### 16.2 Zu viel UI, zu wenig Klarheit

Gegenmaßnahme:

* progressive disclosure
* saved views
* Explain-Why überall

### 16.3 Zu viele Events, nur Stress

Gegenmaßnahme:

* Event-Drosselung
* Clustering
* Priorisierung
* Recovery-Assist

### 16.4 Schlechte Skalierung

Gegenmaßnahme:

* serverautoritatives Kernmodell
* inkrementelle Projektionen
* Web Workers
* aggressive UI-Virtualisierung

---

## 17. North Star

Die perfekte browserbasierte Airline-Simulation für Midcore → Hardcore ist:

**ein hochbedienbares, erklärbares, operations-zentriertes Systemspiel**, in dem der Spieler nicht nur ein Netz baut, sondern es **unter realistischem Druck stabil, effizient und profitabel halten** muss.

Der Browser ist dafür ideal, wenn das Produkt als:

* Planungsoberfläche
* Leitstellen-Konsole
* Analysewerkzeug
* Recovery-Spielraum

gedacht wird — und nicht als billiger Ersatz für einen Desktop-Client.

---

## 18. Nächster Schritt

Direkt ableitbar aus diesem Blueprint:

1. Screenflow für MVP 0.1
2. Domänenmodell als JSON/TypeScript-Schema
3. technische Monorepo-Struktur
4. Ticketliste für Vertical Slice
5. UI-Informationsarchitektur für Dashboard / Schedule / Ops

## 19. MVP 0.1 — konkrete Screen-Definition

## 19.1 Dashboard

### Ziel

Der Spieler soll in unter 30 Sekunden verstehen:

* steht die Airline operativ stabil?
* wo verliert sie Geld?
* wo brennt es gerade?
* welche Entscheidung ist als Nächstes sinnvoll?

### Layout

#### Obere KPI-Leiste

* Cash
* Tagesgewinn / Wochengewinn
* OTP
* durchschnittliche Auslastung
* aktive Alerts
* kritische Tails

#### Linke Spalte

* Top 5 Alerts
* heutige Störungen
* wartungsfällige Aircraft

#### Mitte

* Hub Health Overview
* Delay Heatmap nach Hub / Zeitfenster
* Profit Trend

#### Rechte Spalte

* Top 5 profitable routes
* Bottom 5 routes
* Handlungsempfehlungen / nudges

### Interaktionen

* Klick auf KPI öffnet Drilldown
* Klick auf Alert springt ins Ops Cockpit
* Klick auf Bottom Route springt in Network Planner
* Klick auf Tail springt in Fleet

### Nicht im MVP

* frei konfigurierbare Widgets
* Echtzeit-Collaboration

---

## 19.2 Network Planner

### Ziel

Der Spieler soll Routen bewerten, eröffnen, anpassen oder schließen können.

### Layout

#### Linke Seite

* Karte als Kontext
* Flughäfen / bestehende Routen visualisiert

#### Rechte Seite

Tabellarische Arbeitsfläche mit:

* Route
* Nachfrage-Score
* Distanz
* Wettbewerb light
* empfohlene Frequenz
* grobe Profit-Prognose
* Hub-/Transfer-Beitrag

### Hauptaktionen

* neue Route simulieren
* Frequenz ändern
* Equipment-Vorschlag testen
* Route stilllegen
* Route zur Schedule-Pipeline senden

### Kernkomponenten

* Airport selector
* route candidate list
* what-if drawer
* economic breakdown panel

### UX-Regel

Die Karte ist assistiv, nicht primär. Primär ist die Entscheidungsfläche rechts.

---

## 19.3 Schedule Builder

### Ziel

Der Spieler soll einen Wochenflugplan schnell bauen und sauber validieren können.

### Layout

#### Oben

* Schedule Version Selector
* Draft / Published Status
* Validierungsstatus
* Publish Button

#### Links

* Tail List
* Filter nach Muster / Basis / Zustand

#### Mitte

* Timeline / Rotation Grid pro Tail
* Legs als Blöcke
* Maintenance-Fenster sichtbar
* Konflikte inline markiert

#### Rechts

* Inspector Panel
* ausgewähltes Leg / Tail / Rotation
* Warnungen
* KPI-Vorschau

### Aktionen

* Leg hinzufügen
* Rotation duplizieren
* Tagesmuster kopieren
* Bulk-Verschiebung
* Tail neu zuweisen
* Maintenance-Fenster setzen
* Draft validieren
* Draft publizieren

### Validation Rules MVP

* overlap conflict
* turnaround too short
* aircraft range exceeded
* tail double-booked
* maintenance collision
* excessive daily utilization warning

### Output

* publizierte Schedule-Version
* Änderungsdiff zur Vorversion

---

## 19.4 Ops Cockpit

### Ziel

Hier entsteht die operative Spannung. Der Spieler reagiert auf Störungen und hält das Netz stabil.

### Layout

#### Linke Spalte

* Alert Queue nach Priorität
* Filter nach Hub / Tail / severity

#### Mitte

* Active Incident Detail
* Ursache
* betroffene Legs
* propagierte Folgeeffekte
* Zeit bis Eskalation

#### Rechte Spalte

* Recovery Actions
* Kosten / OTP / Kundenimpact-Vorschau
* recommended action

#### Unterer Bereich

* Network Impact Strip
* betroffene Hubs
* rotierende Tails
* erwartete KPI-Schäden

### Recovery-Aktionen MVP

* delay absorbieren
* tail swap
* Flug streichen
* Flug verschieben
* Reservegerät einsetzen
* Maintenance verschieben mit Risiko

### UX-Regel

Jede Recovery-Aktion braucht vor Ausführung:

* Klartext-Folgen
* Kostenabschätzung
* KPI-Effekt

---

## 20. MVP 0.1 — User Flows

## 20.1 Flow A — erste profitable Route anlegen

1. Spieler öffnet Network Planner
2. wählt Origin- und Zielmarkt
3. sieht Nachfrage, Distanz, grobe Profit-Prognose
4. legt Frequenz und Muster fest
5. sendet Route in den Schedule Builder
6. erstellt Rotation
7. validiert Plan
8. publiziert Schedule
9. beobachtet Route im Dashboard

### Erfolgskriterium

Der Spieler versteht, warum die Route profitabel oder unprofitabel ist.

---

## 20.2 Flow B — Tail-Konflikt im Flugplan beheben

1. Spieler bearbeitet Draft im Schedule Builder
2. Validierung meldet Konflikt
3. Konflikt öffnet Inspector Panel
4. Ursache wird erläutert
5. Spieler verschiebt Leg oder weist neuen Tail zu
6. Validierung läuft erneut
7. Konflikt verschwindet
8. Draft wird publiziert

### Erfolgskriterium

Konfliktbehebung dauert nicht länger als wenige Interaktionen.

---

## 20.3 Flow C — operative Störung retten

1. Live-Betrieb erzeugt Incident
2. Dashboard/Ops Cockpit zeigt High Priority Alert
3. Spieler öffnet Incident
4. sieht Kausalkette und betroffene Legs
5. vergleicht Recovery-Aktionen
6. führt Aktion aus
7. System zeigt neue Prognose
8. Spieler beobachtet Restfolgen

### Erfolgskriterium

Die Entscheidung fühlt sich bedeutend an und ist nachvollziehbar.

---

## 20.4 Flow D — Verlustbringer identifizieren

1. Dashboard zeigt negative Route
2. Klick öffnet Route Breakdown
3. Spieler sieht Nachfrage, Kosten, Auslastung, OTP-Schaden
4. wechselt in Network Planner
5. reduziert Frequenz oder ändert Gerät
6. erstellt neue Draft-Anpassung
7. veröffentlicht Änderungen

### Erfolgskriterium

Analyse → Entscheidung → Umsetzung ohne Medienbruch.

---

## 21. TypeScript-Domänenmodell — erster Zuschnitt

```ts
export type Id = string;
export type ISODateTime = string;
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Airline {
  id: Id;
  name: string;
  cash: number;
  reputation: number;
  stability: number;
  homeBases: Id[];
  createdAt: ISODateTime;
}

export interface Airport {
  id: Id;
  iata: string;
  name: string;
  demandScore: number;
  slotPressure: number;
  weatherRisk: number;
  feeLevel: number;
  transferQuality: number;
}

export interface AircraftType {
  id: Id;
  code: string;
  seats: number;
  rangeKm: number;
  minTurnaroundMin: number;
  costPerBlockHour: number;
  reliabilityBase: number;
}

export interface AircraftTail {
  id: Id;
  airlineId: Id;
  typeId: Id;
  baseAirportId: Id;
  registration: string;
  health: number;
  utilizationTarget: number;
  status: "active" | "reserve" | "maintenance";
}

export interface Route {
  id: Id;
  airlineId: Id;
  originAirportId: Id;
  destinationAirportId: Id;
  weeklyDemand: number;
  competitionScore: number;
  strategicRole: "feeder" | "trunk" | "thin" | "longhaul";
}

export interface FlightLegPlan {
  id: Id;
  routeId: Id;
  dayOfWeek: DayOfWeek;
  departureTimeLocal: string;
  arrivalTimeLocal: string;
  plannedTailId: Id | null;
  plannedAircraftTypeId: Id;
}

export interface MaintenanceWindow {
  id: Id;
  tailId: Id;
  startAt: ISODateTime;
  endAt: ISODateTime;
  severity: "planned" | "required";
}

export interface ScheduleVersion {
  id: Id;
  airlineId: Id;
  versionNo: number;
  status: "draft" | "published" | "archived";
  createdAt: ISODateTime;
}

export interface RotationAssignment {
  id: Id;
  scheduleVersionId: Id;
  tailId: Id;
  legIds: Id[];
}

export interface OpsEvent {
  id: Id;
  airlineId: Id;
  type:
    | "weather"
    | "technical"
    | "late_inbound"
    | "airport_capacity"
    | "maintenance_overrun";
  severity: "low" | "medium" | "high" | "critical";
  occurredAt: ISODateTime;
  affectedAirportId?: Id;
  affectedTailId?: Id;
  affectedLegIds: Id[];
  summary: string;
}

export interface RecoveryOption {
  id: Id;
  eventId: Id;
  type:
    | "absorb_delay"
    | "tail_swap"
    | "cancel_leg"
    | "retime_leg"
    | "activate_reserve"
    | "defer_maintenance";
  estimatedCost: number;
  estimatedOtpDelta: number;
  estimatedCustomerImpact: number;
  description: string;
}

export interface RouteEconomics {
  routeId: Id;
  revenue: number;
  directCost: number;
  contribution: number;
  loadFactor: number;
  otpPenaltyCost: number;
}
```

---

## 22. Vertical Slice — Ticketpakete

## Paket A — Foundations

### Ziel

Lauffähige App-Shell und Domänenbasis.

### Tickets

* Monorepo / App-Struktur anlegen
* UI shell mit Navigation anlegen
* TypeScript domain model aufsetzen
* Mock data layer anlegen
* global state / query layer definieren
* design tokens und base components anlegen

### Acceptance

* App startet
* Navigation funktioniert
* Mock-Daten können in allen Kernscreens verwendet werden

---

## Paket B — Dashboard Slice

### Ziel

Dashboard mit echten Aggregationen aus Mock-/Sim-Daten.

### Tickets

* KPI cards bauen
* alert list bauen
* top/bottom route widget bauen
* hub health widget bauen
* route drilldown anstubsen

### Acceptance

* Dashboard zeigt Airline-Zustand verständlich
* Drilldowns sind verlinkt

---

## Paket C — Network Planner Slice

### Ziel

Route-Bewertung und Übergabe in die Planung.

### Tickets

* airport selector bauen
* route candidate engine mocken
* economics side panel bauen
* create route flow bauen
* handoff in draft schedule implementieren

### Acceptance

* neue Route kann simuliert und an Draft übergeben werden

---

## Paket D — Schedule Builder Slice

### Ziel

Zentraler Flugplan-Editor.

### Tickets

* tail list bauen
* rotation timeline/grid bauen
* leg inspector bauen
* validation engine MVP bauen
* publish flow bauen
* diff view bauen

### Acceptance

* Konflikte werden angezeigt
* Spieler kann Draft validieren und publizieren

---

## Paket E — Ops Cockpit Slice

### Ziel

Erste operative Spannung.

### Tickets

* alert queue bauen
* incident detail panel bauen
* recovery options panel bauen
* ops event generator mocken
* recovery apply flow bauen
* impact preview bauen

### Acceptance

* mindestens 3 Incident-Typen spielbar
* Recovery verändert State nachvollziehbar

---

## Paket F — Sim Core MVP

### Ziel

Eine einfache, aber konsistente Simulation.

### Tickets

* demand/economy tick implementieren
* OTP/delay propagation light implementieren
* maintenance degradation light implementieren
* kpi snapshot generation implementieren
* schedule publish → live run koppeln

### Acceptance

* Schedule erzeugt operative Ergebnisse
* Störungen schlagen auf KPIs durch
* Recovery ändert Outcome

---

## 23. Technischer Vertical Slice — empfohlene Reihenfolge

1. App Shell + Mock Domain
2. Dashboard read-only
3. Network Planner with route creation
4. Schedule Builder with draft state
5. Validation engine
6. Publish flow
7. Live simulation loop
8. Ops events + recovery
9. KPI analytics and drilldowns

---

## 24. Definition of Done für MVP 0.1

Ein Build gilt als MVP-tauglich, wenn:

* ein Spieler eine Airline starten kann
* mindestens 10 sinnvolle Routen planbar sind
* ein Wochenflugplan gebaut und veröffentlicht werden kann
* Konflikte sauber erklärt werden
* Störungen erzeugt und bearbeitet werden können
* Dashboard, Schedule und Ops logisch zusammenspielen
* die Ursachen von Gewinnen, Verlusten und Delays nachvollziehbar sind

---

## 25. Nächster sinnvoller Artefakt-Schritt

Aus diesem Stand sollten als Nächstes erzeugt werden:

1. UI-Informationsarchitektur pro Kernscreen
2. JSON-/TS-Schemas für alle Kernobjekte
3. Repo-/Monorepo-Struktur
4. erste 20–30 konkrete Build-Tickets
5. Wireframe-Textspec für Dashboard / Schedule / Ops

## 26. Repo-/Monorepo-Struktur — Empfehlung

## 26.1 Leitentscheidung

Für dieses Projekt ist ein **pnpm-Workspace-Monorepo** mit klar getrennten Apps und Shared Packages sinnvoll.

Nicht alles in eine einzige Next-App kippen.

### Gründe

* UI, ([pnpm.io](https://pnpm.io/?utm_source=chatgpt.com))
* Wiederverwendbarkeit für Worker, Tests, Mockserver und später Admin/Backoffice
* Build- und Test-Pipelines lassen sich paketweise ausführen
* Vertical Slices bleiben strukturiert statt chaotisch

---

## 26.2 Empfohlene Root-Struktur

```txt
airline-sim/
├─ apps/
│  ├─ web/
│  ├─ sim-service/
│  ├─ worker-sim/
│  └─ docs/                      # optional später
│
├─ packages/
│  ├─ domain/
│  ├─ sim-core/
│  ├─ ui/
│  ├─ app-state/
│  ├─ validation/
│  ├─ analytics/
│  ├─ api-contract/
│  ├─ mocks/
│  ├─ config-eslint/
│  ├─ config-typescript/
│  └─ config-vitest/
│
├─ tooling/
│  ├─ scripts/
│  └─ generators/
│
├─ tests/
│  ├─ e2e/
│  ├─ integration/
│  └─ fixtures/
│
├─ .github/
│  └─ workflows/
│
├─ pnpm-workspace.yaml
├─ turbo.json
├─ package.json
├─ tsconfig.base.json
└─ README.md
```

---

## 26.3 Apps im Detail

## apps/web

Die Browser-App.

### Verantwortung

* Next.js App-Shell
* Routing
* Auth light
* Kernscreens
* WebSocket-Anbindung
* Worker-Orchestrierung
* IndexedDB-Integration
* user-facing UI

### Interne Struktur

```txt
apps/web/
├─ app/
│  ├─ (app)/
│  │  ├─ dashboard/
│  │  ├─ network/
│  │  ├─ schedule/
│  │  ├─ ops/
│  │  ├─ fleet/
│  │  └─ finance/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
│
├─ src/
│  ├─ features/
│  │  ├─ dashboard/
│  │  ├─ network/
│  │  ├─ schedule/
│  │  ├─ ops/
│  │  ├─ fleet/
│  │  └─ finance/
│  ├─ components/
│  ├─ lib/
│  ├─ hooks/
│  ├─ workers/
│  ├─ stores/
│  └─ indexeddb/
│
├─ public/
├─ next.config.ts
└─ package.json
```

### Warum so?

* `app/` bleibt für Route- und Layout-Struktur
* echte Featurelogik lebt in `src/features/*`
* Next-Routing wird nicht mit Domänenlogik vermischt

---

## apps/sim-service

Autoritativer Backend-Service.

### Verantwortung

* Commands annehmen
* Schedule validieren
* Published Schedule in Live-State überführen
* Events erzeugen
* Recovery anwenden
* KPI-Snapshots berechnen
* WebSocket-State verteilen

### Interne Struktur

```txt
apps/sim-service/
├─ src/
│  ├─ application/
│  ├─ domain-services/
│  ├─ command-handlers/
│  ├─ projections/
│  ├─ realtime/
│  ├─ repositories/
│  ├─ jobs/
│  └─ main.ts
└─ package.json
```

---

## apps/worker-sim

Separater Prozess für Sim-Jobs / Tick-Verarbeitung.

### Verantwortung

* zeitbasierte Simulationsjobs
* Event-Generierung
* Batch-Rebuilds
* KPI-Reaggregation
* schwere Berechnungen auslagern

### Hinweis

Für den allerersten Vertical Slice kann das noch im `sim-service` leben.
Die Trennung ist aber strukturell vorbereitet.

---

## 26.4 Packages im Detail

## packages/domain

Die kanonischen Typen und Schemas.

### Enthält

* Entities
* Value Objects
* Enums
* IDs
* Zod-Schemas
* Serialization Contracts

### Regel

Keine UI, keine Netzwerkanbindung, keine Seiteneffekte.

---

## packages/sim-core

Deterministische Kernlogik.

### Enthält

* Nachfrageberechnung
* Delay-Propagation
* Wartungsdegradation
* Route-/Rotation-Scoring
* Recovery-Auswirkungen

### Regel

So rein wie möglich. Diese Logik muss testbar und reproduzierbar sein.

---

## packages/ui

Wiederverwendbare UI-Bausteine.

### Enthält

* KPI cards
* table primitives
* timeline primitives
* inspectors
* alert components
* charts wrapper

### Regel

Keine Business-Logik.

---

## packages/app-state

Frontend-seitige Orchestrierung.

### Enthält

* Query keys
* selectors
* client state slices
* optimistic draft helpers
* derived client view models

---

## packages/validation

Validierungslogik für Drafts und Commands.

### Enthält

* schedule validation rules
* command validation
* domain invariants
* explainable validation results

---

## packages/analytics

Berechnung von KPI-Views und Breakdown-Modellen.

### Enthält

* KPI aggregations
* route economics breakdown
* hub health scoring
* explain-why payload builders

---

## packages/api-contract

Verträge zwischen Frontend und Backend.

### Enthält

* DTOs
* command payloads
* event payloads
* websocket message shapes
* pagination / filtering contracts

---

## packages/mocks

Mockdaten, Seed-Szenarien, Fixture-Builder.

### Enthält

* airports fixtures
* aircraft fixtures
* route scenarios
* incident scenarios
* demo airlines

---

## packages/config-*

Zentrale Tooling-Konfigurationen.

### Enthält

* eslint config
* tsconfig presets
* vitest presets

Ziel: keine Copy-Paste-Konfigurationshölle.

---

## 26.5 Technologie-Zuschnitt pro Verantwortung

## Frontend

* Next.js als App-Shell
* React für Workspaces
* TanStack Query für Server-State
* lokaler Client-State für UI-Interaktionen
* Web Workers für schwere clientseitige Vorschau-Rechnungen
* IndexedDB für Drafts / Cache / Replays light

## Backend

* Node.js/TypeScript
* API + WebSocket Gateway
* autoritativer Sim-Layer
* relationale Persistenz

## Testen

* Vitest für Unit- und Package-Tests
* Playwright für E2E-Flows

---

## 26.6 Package-Abhängigkeiten — Regeln

### Erlaubte Richtung

* `apps/*` dürfen `packages/*` konsumieren
* `packages/ui` darf `packages/domain` konsumieren
* `packages/sim-core` darf `packages/domain` konsumieren
* `packages/analytics` darf `packages/domain` und `packages/sim-core` konsumieren
* `packages/api-contract` darf `packages/domain` konsumieren

### Verboten

* `packages/domain` darf nichts aus UI oder Apps importieren
* `packages/sim-core` darf nicht von Next/Web abhängen
* `packages/ui` darf keine Backend-Abhängigkeiten haben

---

## 26.7 Naming-Konventionen

### Apps

* `@airline-sim/web`
* `@airline-sim/sim-service`
* `@airline-sim/worker-sim`

### Packages

* `@airline-sim/domain`
* `@airline-sim/sim-core`
* `@airline-sim/ui`
* `@airline-sim/app-state`
* `@airline-sim/validation`
* `@airline-sim/analytics`
* `@airline-sim/api-contract`
* `@airline-sim/mocks`

---

## 26.8 Turbo Tasks — Zielbild

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "e2e": {
      "dependsOn": ["build"],
      "cache": false
    }
  }
}
```

---

## 26.9 Root Scripts — Empfehlung

```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "e2e": "turbo run e2e",
    "format": "turbo run format"
  }
}
```

---

## 26.10 Test-Struktur

## Unit Tests

Direkt in den Packages:

* `packages/sim-core`
* `packages/validation`
* `packages/analytics`
* `packages/domain`

## Integration Tests

In `tests/integration`:

* publish schedule → creates live state
* ops event → recovery → KPI delta
* invalid rotation → explainable validation error

## E2E Tests

In `tests/e2e`:

* route creation flow
* schedule publish flow
* ops incident recovery flow
* dashboard drilldown flow

---

## 26.11 Was ich bewusst nicht empfehle

* alles nur in `apps/web`
* Sim-Core direkt in React Hooks
* Validierung nur clientseitig
* packageübergreifende relative Import-Suppe
* zu frühe Microservices
* GraphQL als Selbstzweck

---

## 27. Backlog — erste 30 Build-Tickets

## Gruppe 1 — Monorepo Foundations

### T001

pnpm-Workspace und Root-Tooling anlegen

### T002

Turborepo konfigurieren

### T003

Root TypeScript Base Config anlegen

### T004

Shared ESLint Config extrahieren

### T005

Shared Vitest Config extrahieren

### T006

Package Naming und Import-Aliase festlegen

---

## Gruppe 2 — Domain & Contracts

### T007

`@airline-sim/domain` anlegen

### T008

Kern-Entities als TypeScript-Typen modellieren

### T009

Zod-Schemas für Kern-Entities anlegen

### T010

ID-/Enum-/Value-Object-Konzept festlegen

### T011

`@airline-sim/api-contract` anlegen

### T012

DTOs für Dashboard / Network / Schedule / Ops definieren

---

## Gruppe 3 — Sim Core

### T013

`@airline-sim/sim-core` anlegen

### T014

Route-Economics-Basismodell implementieren

### T015

Tail-Utilization-Berechnung implementieren

### T016

Delay-Propagation light implementieren

### T017

Maintenance-Degradation light implementieren

### T018

Recovery-Outcome-Rechner implementieren

---

## Gruppe 4 — Validation

### T019

`@airline-sim/validation` anlegen

### T020

Schedule-Overlap-Validation implementieren

### T021

Turnaround-Minimum-Validation implementieren

### T022

Range-Validation implementieren

### T023

Maintenance-Collision-Validation implementieren

### T024

Explainable Validation Result Format definieren

---

## Gruppe 5 — Web App Shell

### T025

`apps/web` mit Next.js App Router anlegen

### T026

Root Layout, Navigation und App Shell bauen

### T027

Feature-Ordnerstruktur in `src/features/*` anlegen

### T028

Design Tokens und Basiskomponenten aufsetzen

### T029

TanStack Query Integration aufsetzen

### T030

IndexedDB-Abstraktion für lokale Drafts anlegen

---

## Gruppe 6 — Dashboard Slice

### T031

Dashboard KPI Cards implementieren

### T032

Alert List implementieren

### T033

Top/Bottom Routes Widget implementieren

### T034

Hub Health Widget implementieren

### T035

Dashboard Drilldowns verdrahten

---

## Gruppe 7 — Network Planner Slice

### T036

Airport Selector und Candidate Table bauen

### T037

Route Simulation Drawer bauen

### T038

Economics Breakdown Panel bauen

### T039

Create-Route-Flow an Draft Schedule anbinden

---

## Gruppe 8 — Schedule Builder Slice

### T040

Tail List und Filter bauen

### T041

Rotation Grid / Timeline bauen

### T042

Leg Inspector bauen

### T043

Draft-State und Versioning bauen

### T044

Validation in der UI anzeigen

### T045

Publish Flow implementieren

---

## Gruppe 9 — Ops Cockpit Slice

### T046

Alert Queue bauen

### T047

Incident Detail Panel bauen

### T048

Recovery Options Panel bauen

### T049

Apply-Recovery-Flow bauen

### T050

Network Impact Strip bauen

---

## Gruppe 10 — Backend / Sim Service

### T051

`apps/sim-service` anlegen

### T052

Read API für Dashboard implementieren

### T053

Command API für Draft-/Publish-Flows implementieren

### T054

WebSocket-Gateway für Alerts und State Deltas implementieren

### T055

Live Tick / Projection Loop MVP implementieren

---

## Gruppe 11 — Tests

### T056

Unit-Tests für sim-core Basismodelle schreiben

### T057

Unit-Tests für Validation Rules schreiben

### T058

Integrationstest: Publish Schedule → Live State

### T059

Integrationstest: Ops Event → Recovery → KPI Delta

### T060

Playwright E2E: Route → Schedule → Publish → Incident → Recovery

---

## 28. Empfohlene Ticket-Reihenfolge für den ersten Sprintblock

### Sprintblock 1

* T001–T012

### Sprintblock 2

* T013–T024

### Sprintblock 3

* T025–T035

### Sprintblock 4

* T036–T045

### Sprintblock 5

* T046–T055

### Sprintblock 6

* T056–T060

---

## 29. Minimaler Vertical Slice, der früh sichtbar sein muss

Der erste wirklich wertvolle Slice ist:

* Route simulieren
* in Draft Schedule übernehmen
* Rotation validieren
* Schedule publizieren
* Incident erzeugen
* Recovery anwenden
* KPI-Veränderung sehen

Wenn das sitzt, lebt das Spiel.
Wenn das nicht sitzt, ist alles andere Deko.
