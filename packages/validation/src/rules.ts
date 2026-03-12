import { FlightLegPlan, AircraftType, MaintenanceWindow } from "@airline-sim/domain";
import { ExplainableValidationResult } from "./types";

export function validateSchedule(
    legs: FlightLegPlan[],
    aircraftSpecs: Record<string, AircraftType>,
    maintenanceWindows: MaintenanceWindow[]
): ExplainableValidationResult {
    const errors: ExplainableValidationResult["errors"] = [];
    const warnings: ExplainableValidationResult["warnings"] = [];

    // Mock implementation for vertical slice:
    // 1. T020 Overlap Validation
    // Group by tail and check time overlap

    // 2. T021 Turnaround Minimum Validation
    // Check if buffer between legs >= minTurnaroundMin

    // 3. T022 Range Validation
    // Assuming we have origin/destination distance, if distance > aircraft.rangeKm -> error

    // 4. T023 Maintenance Collision Validation
    legs.forEach(leg => {
        if (!leg.assignedTailId) return;

        maintenanceWindows.forEach(window => {
            if (window.tailId !== leg.assignedTailId) return;

            const legStart = new Date(leg.departureTimeUtc).getTime();
            const legEnd = new Date(leg.arrivalTimeUtc).getTime();
            const winStart = new Date(window.startTimeUtc).getTime();
            const winEnd = new Date(window.endTimeUtc).getTime();

            const overlap = Math.max(0, Math.min(legEnd, winEnd) - Math.max(legStart, winStart));
            if (overlap > 0) {
                errors.push({
                    code: "maintenance_collision",
                    message: `Flight ${leg.flightNumber} overlaps with scheduled maintenance.`,
                    affectedLegIds: [leg.id]
                });
            }
        });
    });

    if (legs.length === 0) {
        warnings.push({ code: "empty_schedule", message: "Schedule has no legs defined." });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
