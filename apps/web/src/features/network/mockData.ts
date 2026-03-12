import { Airport, AircraftType } from "@airline-sim/domain";
import { RouteCandidate } from "./types";

export const MOCK_AIRPORTS: Airport[] = [
    { id: "a1", iata: "JFK", name: "New York", demandScore: 95, slotPressure: 90, weatherRisk: 60, feeLevel: 80, transferQuality: 50 },
    { id: "a2", iata: "LHR", name: "London Heathrow", demandScore: 98, slotPressure: 95, weatherRisk: 70, feeLevel: 90, transferQuality: 70 },
    { id: "a3", iata: "FRA", name: "Frankfurt", demandScore: 85, slotPressure: 80, weatherRisk: 50, feeLevel: 70, transferQuality: 85 },
    { id: "a4", iata: "DXB", name: "Dubai", demandScore: 90, slotPressure: 70, weatherRisk: 10, feeLevel: 60, transferQuality: 95 },
];

export const MOCK_AIRCRAFT_TYPES: AircraftType[] = [
    { id: "ac1", code: "A320", seats: 180, rangeKm: 6100, minTurnaroundMin: 45, costPerBlockHour: 3500, reliabilityBase: 98 },
    { id: "ac2", code: "B77W", seats: 350, rangeKm: 13600, minTurnaroundMin: 90, costPerBlockHour: 8000, reliabilityBase: 97 },
];

export const MOCK_CANDIDATES: RouteCandidate[] = [
    { id: "c1", origin: MOCK_AIRPORTS[0], destination: MOCK_AIRPORTS[1], distanceKm: 5540, demandScore: 96, competition: "High", estimatedContribution: 12000 },
    { id: "c2", origin: MOCK_AIRPORTS[2], destination: MOCK_AIRPORTS[0], distanceKm: 6200, demandScore: 88, competition: "Medium", estimatedContribution: 8500 },
    { id: "c3", origin: MOCK_AIRPORTS[3], destination: MOCK_AIRPORTS[1], distanceKm: 5470, demandScore: 92, competition: "High", estimatedContribution: 15400 },
];
