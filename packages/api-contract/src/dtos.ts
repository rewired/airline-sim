import { z } from "zod";
import {
    AirlineSchema,
    OpsEventSchema,
    RouteEconomicsSchema,
    AircraftTailSchema,
    AirportSchema
} from "@airline-sim/domain";

// Dashboard DTOs
export const DashboardOverviewResponseSchema = z.object({
    airline: AirlineSchema,
    profitToday: z.number(),
    profitWeek: z.number(),
    networkOtp: z.number(),
    averageLoadFactor: z.number(),
    activeAlerts: z.array(OpsEventSchema),
    criticalTails: z.array(AircraftTailSchema),
});
export type DashboardOverviewResponse = z.infer<typeof DashboardOverviewResponseSchema>;

// Network Planner DTOs
export const NetworkRouteCandidateResponseSchema = z.object({
    origin: AirportSchema,
    destination: AirportSchema,
    estimatedDemand: z.number(),
    competitionLevel: z.number(),
    distanceKm: z.number(),
    estimatedProfitability: z.enum(["high", "medium", "low", "negative"]),
});
export type NetworkRouteCandidateResponse = z.infer<typeof NetworkRouteCandidateResponseSchema>;

// Schedule Builder DTOs
export const PublishScheduleRequestSchema = z.object({
    scheduleVersionId: z.string().uuid(),
});
export type PublishScheduleRequest = z.infer<typeof PublishScheduleRequestSchema>;

export const ValidationResultSchema = z.object({
    isValid: z.boolean(),
    errors: z.array(z.object({
        code: z.string(),
        message: z.string(),
        affectedLegs: z.array(z.string().uuid()).optional(),
    })),
    warnings: z.array(z.object({
        code: z.string(),
        message: z.string(),
    })),
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// Ops Cockpit DTOs
export const ApplyRecoveryRequestSchema = z.object({
    eventId: z.string().uuid(),
    recoveryOptionId: z.string().uuid(),
});
export type ApplyRecoveryRequest = z.infer<typeof ApplyRecoveryRequestSchema>;

export const OpsActiveIncidentsResponseSchema = z.object({
    incidents: z.array(OpsEventSchema),
});
export type OpsActiveIncidentsResponse = z.infer<typeof OpsActiveIncidentsResponseSchema>;
