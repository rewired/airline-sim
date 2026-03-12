import { Airport, AircraftType } from "@airline-sim/domain";

export interface RouteCandidate {
    id: string;
    origin: Airport;
    destination: Airport;
    distanceKm: number;
    demandScore: number;
    weeklyDemand?: number;      // T070 persistence
    competitionScore?: number;  // T070 persistence
    competition: "Low" | "Medium" | "High";
    estimatedContribution: number;
}

export interface SimulationParams {
    aircraftTypeId: string | null;
    weeklyFrequency: number;
    ticketPrice: number;
}
