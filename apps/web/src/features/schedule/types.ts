import { Airport, AircraftTail } from "@airline-sim/domain";

export interface FlightLegDraft {
    id: string;
    flightNumber: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    departureTimeUtc: string; // ISO 8601
    arrivalTimeUtc: string;   // ISO 8601
    assignedTailId: string | null;
    state: "draft" | "published";
}

export interface ValidationIssue {
    id: string;
    type: "overlap" | "turnaround" | "maintenance" | "range" | "curfew";
    severity: "error" | "warning";
    message: string;
    affectedLegIds: string[];
}
