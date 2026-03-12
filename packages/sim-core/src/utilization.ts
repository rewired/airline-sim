import { RotationAssignment, AircraftTail, FlightLegPlan } from "@airline-sim/domain";

export function calculateUtilization(
    assignment: RotationAssignment,
    legs: FlightLegPlan[],
    tail: AircraftTail
): number {
    // Mock logic: calculate block hours of all legs
    // Assuming 2 hours per leg as a placeholder
    const totalHours = legs.length * 2;
    const targetWeeklyHours = tail.utilizationTarget * 7;
    return totalHours / targetWeeklyHours;
}
