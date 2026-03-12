import { z } from "zod";
import { IdSchema, ISODateTimeSchema, DayOfWeekSchema } from "./core";

export const AirlineSchema = z.object({
  id: IdSchema,
  name: z.string(),
  cash: z.number(),
  reputation: z.number(),
  stability: z.number(),
  homeBases: z.array(IdSchema),
  createdAt: ISODateTimeSchema,
});
export type Airline = z.infer<typeof AirlineSchema>;

export const AirportSchema = z.object({
  id: IdSchema,
  iata: z.string().length(3),
  name: z.string(),
  demandScore: z.number(),
  slotPressure: z.number(),
  weatherRisk: z.number(),
  feeLevel: z.number(),
  transferQuality: z.number(),
});
export type Airport = z.infer<typeof AirportSchema>;

export const AircraftTypeSchema = z.object({
  id: IdSchema,
  code: z.string(),
  seats: z.number(),
  rangeKm: z.number(),
  minTurnaroundMin: z.number(),
  costPerBlockHour: z.number(),
  reliabilityBase: z.number(),
});
export type AircraftType = z.infer<typeof AircraftTypeSchema>;

export const AircraftTailSchema = z.object({
  id: IdSchema,
  airlineId: IdSchema,
  typeId: IdSchema,
  baseAirportId: IdSchema,
  registration: z.string(),
  health: z.number(),
  utilizationTarget: z.number(),
  status: z.enum(["active", "reserve", "maintenance"]),
});
export type AircraftTail = z.infer<typeof AircraftTailSchema>;

export const RouteSchema = z.object({
  id: IdSchema,
  airlineId: IdSchema,
  originAirportId: IdSchema,
  destinationAirportId: IdSchema,
  weeklyDemand: z.number(),
  competitionScore: z.number(),
  strategicRole: z.enum(["feeder", "trunk", "thin", "longhaul"]),
});
export type Route = z.infer<typeof RouteSchema>;

export const FlightLegPlanSchema = z.object({
  id: IdSchema,
  routeId: IdSchema,
  dayOfWeek: DayOfWeekSchema,
  // Canonical scheduling fields used across Domain + Validation + Services.
  // Do not introduce aliases such as assignedTailId/departureTimeUtc/arrivalTimeUtc.
  departureTimeLocal: z.string(), // "HH:mm"
  arrivalTimeLocal: z.string(), // "HH:mm"
  plannedTailId: IdSchema.nullable(),
  plannedAircraftTypeId: IdSchema,
});
export type FlightLegPlan = z.infer<typeof FlightLegPlanSchema>;

export const MaintenanceWindowSchema = z.object({
  id: IdSchema,
  tailId: IdSchema,
  startAt: ISODateTimeSchema,
  endAt: ISODateTimeSchema,
  severity: z.enum(["planned", "required"]),
});
export type MaintenanceWindow = z.infer<typeof MaintenanceWindowSchema>;

export const ScheduleVersionSchema = z.object({
  id: IdSchema,
  airlineId: IdSchema,
  versionNo: z.number(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: ISODateTimeSchema,
});
export type ScheduleVersion = z.infer<typeof ScheduleVersionSchema>;

export const RotationAssignmentSchema = z.object({
  id: IdSchema,
  scheduleVersionId: IdSchema,
  tailId: IdSchema,
  legIds: z.array(IdSchema),
});
export type RotationAssignment = z.infer<typeof RotationAssignmentSchema>;

export const OpsEventSchema = z.object({
  id: IdSchema,
  airlineId: IdSchema,
  type: z.enum([
    "weather",
    "technical",
    "late_inbound",
    "airport_capacity",
    "maintenance_overrun",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  occurredAt: ISODateTimeSchema,
  affectedAirportId: IdSchema.optional(),
  affectedTailId: IdSchema.optional(),
  affectedLegIds: z.array(IdSchema),
  summary: z.string(),
});
export type OpsEvent = z.infer<typeof OpsEventSchema>;

export const RecoveryOptionSchema = z.object({
  id: IdSchema,
  eventId: IdSchema,
  type: z.enum([
    "absorb_delay",
    "tail_swap",
    "cancel_leg",
    "retime_leg",
    "activate_reserve",
    "defer_maintenance",
  ]),
  estimatedCost: z.number(),
  estimatedOtpDelta: z.number(),
  estimatedCustomerImpact: z.number(),
  description: z.string(),
});
export type RecoveryOption = z.infer<typeof RecoveryOptionSchema>;

export const RouteEconomicsSchema = z.object({
  routeId: IdSchema,
  revenue: z.number(),
  directCost: z.number(),
  contribution: z.number(),
  loadFactor: z.number(),
  otpPenaltyCost: z.number(),
});
export type RouteEconomics = z.infer<typeof RouteEconomicsSchema>;
