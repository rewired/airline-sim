# DD (Domain Design)
> Completeness rule: All details from `docs/IDEAS.md` remain binding; this document structures the content without extension.

## Core Systems
### Airline Structure
- Airline
- Brand profile / positioning
- Base airports
- Hubs
- Fleet
- Cash / debt / leasing
- Reputation
- Operational stability

### Airports
Per airport at minimum:
- Size / demand weight
- O&D demand profiles
- Slot pressure
- Fee level
- Ground turn efficiency
- Weather/disruption propensity
- Transfer quality
- Curfew / restrictions light

### Aircraft
Per type / tail:
- Seating capacity
- Range
- Minimum turnaround
- Cost profile
- Maintenance condition
- Reliability
- Suitability for short-/medium-/long-haul
- Tail-specific history

Abstraction for MVP:
- Start with simplified tail-individual data
- later, more detailed reliability, aging, check intervals

### Demand and Economics
Systems:
- O&D demand
- Transfer traffic via hubs
- Demand seasonality
- Price elasticity light
- Service/brand bonus light
- Competitive pressure

Costs:
- Fixed costs
- Leasing / financing
- Fuel abstracted
- Airport fees
- Maintenance costs
- Crew costs at pool level
- Delay/cancellation costs

Metrics:
- Profit per route
- Profit per rotation
- Load factor
- Yield
- RASK / CASK light
- OTP
- Irregularity Cost
- Hub Integrity

### Scheduling / Rotation
Functions:
- Weekly flight schedule
- Rotation building per tail
- Templates
- Recurring frequencies
- Waves / banks at hubs
- Minimum buffer / turnaround
- Maintenance slots
- Conflict checking

Validation:
- Overlaps
- Unrealistic ground times
- Range violations
- Maintenance collisions
- Hub risks
- Overuse of individual tails

### Operations / IRROPS
Event types:
- Weather
- Tail technical issue
- Delayed inbound rotation
- Reduced airport capacity
- Maintenance overrun
- Staff shortage as a pool event

Player actions:
- Tail swap
- Absorb delay
- Cancel flight
- Merge frequency
- Activate reserve aircraft
- Defer maintenance with risk

### Maintenance
MVP:
- Health state per tail
- planned maintenance windows
- Reliability penalty when neglected
- Higher AOG/delay probability

Later:
- A-check-like cycles
- Fleet aging
- Spare-part/capacity pressure abstracted

### Crew
MVP:
- Crew pools per base / fleet group
- Capacity and availability
- Bottleneck effect on recovery and plannability

Later optional:
- duty legality light
- Repositioning
- Reserve crew strategy

### Competition
MVP initially solo world or isolated shards.

Later:
- AI airlines or shared world
- Competition on routes
- Yield pressure
- Hub battles
- Slot scarcity

## Data Model — High-Level
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

## TypeScript Domain Model — First Cut
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
