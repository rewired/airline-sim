# DD (Domain Design)
> Vollständigkeitsregel: Alle Details aus `docs/IDEAS.md` bleiben verbindlich; dieses Dokument strukturiert die Inhalte ohne Erweiterung.

## Kernsysteme
### Airline-Struktur
- Airline
- Markenprofil / Positionierung
- Basisflughäfen
- Hubs
- Flotte
- Cash / Schulden / Leasing
- Reputation
- Betriebsstabilität

### Flughäfen
Pro Flughafen mindestens:
- Größe / Nachfragegewicht
- O&D-Nachfrageprofile
- Slot-Druck
- Gebührenniveau
- Ground-Turn-Effizienz
- Wetter-/Störungsneigung
- Transferqualität
- Curfew / Restriktionen light

### Flugzeuge
Pro Muster / Tail:
- Sitzkapazität
- Reichweite
- Turnaround-Minimum
- Kostenprofil
- Wartungszustand
- Zuverlässigkeit
- Eignung für Kurz-/Mittel-/Langstrecke
- Tail-spezifische Historie

Abstraktion für MVP:
- Start mit vereinfachten Tail-individuellen Daten
- später detailliertere Zuverlässigkeit, Alterung, Check-Intervalle

### Nachfrage und Wirtschaft
Systeme:
- O&D-Nachfrage
- Transferverkehr über Hubs
- Nachfrage-Saisonalität
- Preiselastizität light
- Service-/Markenbonus light
- Konkurrenzdruck

Kosten:
- Fixkosten
- Leasing / Finanzierung
- Treibstoff abstrahiert
- Flughafengebühren
- Wartungskosten
- Crewkosten auf Pool-Ebene
- Verspätungs-/Stornokosten

Kennzahlen:
- Profit pro Route
- Profit pro Rotation
- Auslastung
- Yield
- RASK / CASK light
- OTP
- Irregularity Cost
- Hub Integrity

### Scheduling / Rotation
Funktionen:
- Flugplan auf Wochenbasis
- Rotationsbau pro Tail
- Vorlagen / Templates
- Wiederkehrende Frequenzen
- Wellen / Banks an Hubs
- Mindestpuffer / Turnaround
- Maintenance-Slots
- Konfliktprüfung

Validierung:
- Überschneidungen
- unrealistische Bodenzeiten
- Reichweitenverletzungen
- Wartungskollisionen
- Hub-Risiken
- Übernutzung einzelner Tails

### Operations / IRROPS
Eventtypen:
- Wetter
- Tail technical issue
- verspätete Vorrotation
- reduzierte Flughafen-Kapazität
- Maintenance overrun
- Personalmangel als Pool-Event

Spieleraktionen:
- Tail swap
- Delay absorbieren
- Flug streichen
- Frequenz zusammenlegen
- Ersatzgerät aktivieren
- Maintenance verschieben mit Risiko

### Wartung
MVP:
- Health-Zustand je Tail
- planned maintenance windows
- reliability penalty bei Vernachlässigung
- höhere AOG-/Delay-Wahrscheinlichkeit

Später:
- A-check-artige Zyklen
- Flottenalterung
- Ersatzteil-/Kapazitätsdruck abstrahiert

### Crew
MVP:
- Crew-Pools je Basis / Flottengruppe
- Kapazität und Verfügbarkeit
- Engpass-Effekt auf Recovery und Planbarkeit

Später optional:
- duty legality light
- Repositioning
- Reserve-Crew-Strategie

### Wettbewerb
MVP zunächst Solo-Welt oder isolierte Shards.

Später:
- KI-Airlines oder Shared World
- Konkurrenz auf Strecken
- Yield-Druck
- Hub-Kämpfe
- Slot-Knappheit

## Datenmodell — grob
### Entities
#### Airline
- id
- name
- cash
- reputation
- brand_profile
- created_at

#### Airport
- id
- iata
- name
- demand_profile
- slot_profile
- weather_profile
- fee_profile

#### AircraftType
- id
- code
- seats_default
- range_km
- turnaround_min
- operating_cost_profile
- reliability_base

#### AircraftTail
- id
- type_id
- airline_id
- base_airport_id
- health
- age_factor
- maintenance_due_state
- status

#### Route
- id
- airline_id
- origin_airport_id
- destination_airport_id
- market_score
- competition_score
- strategy_role

#### FlightLegTemplate
- id
- route_id
- day_of_week
- dep_time
- arr_time
- aircraft_type_constraint

#### Rotation
- id
- tail_id
- schedule_version_id
- sequence_index

#### OpsEvent
- id
- type
- severity
- timestamp
- affected_tail_id
- affected_airport_id
- impact_payload

#### RecoveryDecision
- id
- event_id
- decision_type
- cost_delta
- otp_delta
- customer_impact_delta

## TypeScript-Domänenmodell — erster Zuschnitt
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
