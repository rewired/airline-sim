import { OpsFlightLeg } from "./types";
import { MOCK_AIRPORTS } from "../network/mockData";

const now = new Date();
const past = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
const future = new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(); // 1 hour from now
const delayed = new Date(now.getTime() + 45 * 60 * 1000).toISOString(); // 45 min delay

export const MOCK_OPS_FLIGHTS: OpsFlightLeg[] = [
    { id: "o1", flightNumber: "AO100", tailRegistration: "D-AIAA", departureAirport: MOCK_AIRPORTS[0], arrivalAirport: MOCK_AIRPORTS[1], scheduledDepartureUtc: past, estimatedDepartureUtc: past, status: "in_flight", delayReason: null },
    { id: "o2", flightNumber: "AO200", tailRegistration: "D-AIAB", departureAirport: MOCK_AIRPORTS[1], arrivalAirport: MOCK_AIRPORTS[2], scheduledDepartureUtc: past, estimatedDepartureUtc: past, status: "arrived", delayReason: null },
    { id: "o3", flightNumber: "AO300", tailRegistration: "D-AIBC", departureAirport: MOCK_AIRPORTS[2], arrivalAirport: MOCK_AIRPORTS[0], scheduledDepartureUtc: future, estimatedDepartureUtc: delayed, status: "delayed", delayReason: "Technical (AOG)" },
    { id: "o4", flightNumber: "AO400", tailRegistration: "D-AIBD", departureAirport: MOCK_AIRPORTS[0], arrivalAirport: MOCK_AIRPORTS[1], scheduledDepartureUtc: future, estimatedDepartureUtc: future, status: "boarding", delayReason: null },
];
