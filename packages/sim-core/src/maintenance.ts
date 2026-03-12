import { AircraftTail } from "@airline-sim/domain";

export function calculateMaintenanceDegradation(
    tail: AircraftTail,
    flightHours: number
): number {
    // Lower health based on flight hours
    const degradation = flightHours * 0.05;
    return Math.max(0, tail.health - degradation);
}
