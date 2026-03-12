import { Airport, AircraftTail, AircraftType } from "@airline-sim/domain";
import { FlightLegDraft, ValidationIssue } from "./types";
import { MOCK_AIRPORTS, MOCK_AIRCRAFT_TYPES } from "../network/mockData";

export const MOCK_TAILS: AircraftTail[] = [
    { id: "t1", registration: "D-AIAA", typeId: "ac1", status: "active", airlineId: "a1", baseAirportId: "a1", health: 100, utilizationTarget: 12 },
    { id: "t2", registration: "D-AIAB", typeId: "ac1", status: "active", airlineId: "a1", baseAirportId: "a1", health: 100, utilizationTarget: 12 },
    { id: "t3", registration: "D-AIBA", typeId: "ac2", status: "active", airlineId: "a1", baseAirportId: "a1", health: 100, utilizationTarget: 12 },
];

const today = new Date().toISOString().split('T')[0];

export const MOCK_LEGS: FlightLegDraft[] = [
    { id: "l1", flightNumber: "AO100", departureAirport: MOCK_AIRPORTS[0], arrivalAirport: MOCK_AIRPORTS[1], departureTimeUtc: `${today}T08:00:00Z`, arrivalTimeUtc: `${today}T15:30:00Z`, assignedTailId: "t3", state: "draft" },
    { id: "l2", flightNumber: "AO101", departureAirport: MOCK_AIRPORTS[1], arrivalAirport: MOCK_AIRPORTS[2], departureTimeUtc: `${today}T17:00:00Z`, arrivalTimeUtc: `${today}T19:30:00Z`, assignedTailId: "t3", state: "draft" },
    { id: "l3", flightNumber: "AO200", departureAirport: MOCK_AIRPORTS[2], arrivalAirport: MOCK_AIRPORTS[0], departureTimeUtc: `${today}T09:00:00Z`, arrivalTimeUtc: `${today}T11:45:00Z`, assignedTailId: "t1", state: "draft" },
    { id: "l4", flightNumber: "AO201", departureAirport: MOCK_AIRPORTS[0], arrivalAirport: MOCK_AIRPORTS[2], departureTimeUtc: `${today}T13:00:00Z`, arrivalTimeUtc: `${today}T16:15:00Z`, assignedTailId: "t1", state: "draft" },
];

export const MOCK_ISSUES: ValidationIssue[] = [
    { id: "v1", type: "turnaround", severity: "warning", message: "Turnaround at LHR is only 90m (requires 120m for B77W).", affectedLegIds: ["l1", "l2"] }
];
