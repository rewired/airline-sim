import { Airport } from "@airline-sim/domain";

export interface OpsFlightLeg {
    id: string;
    flightNumber: string;
    tailRegistration: string;
    departureAirport: Airport;
    arrivalAirport: Airport;
    scheduledDepartureUtc: string;
    estimatedDepartureUtc: string;
    status: "boarding" | "in_flight" | "delayed" | "arrived" | "diverted" | "cancelled";
    delayReason: string | null;
}
