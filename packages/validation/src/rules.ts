import {
  FlightLegPlan,
  AircraftType,
  MaintenanceWindow,
} from "@airline-sim/domain";
import { ExplainableValidationResult } from "./types";

export function validateSchedule(
  legs: FlightLegPlan[],
  aircraftSpecs: Record<string, AircraftType>,
  maintenanceWindows: MaintenanceWindow[],
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
  // Interpret the weekly leg plan as a reference week in UTC for coarse overlap checks.
  const referenceMondayUtc = new Date(Date.UTC(2025, 0, 6, 0, 0, 0, 0));

  legs.forEach((leg) => {
    if (!leg.plannedTailId) return;

    maintenanceWindows.forEach((window) => {
      if (window.tailId !== leg.plannedTailId) return;

      const [depHour, depMin] = leg.departureTimeLocal.split(":").map(Number);
      const [arrHour, arrMin] = leg.arrivalTimeLocal.split(":").map(Number);

      const legStart = new Date(referenceMondayUtc);
      legStart.setUTCDate(
        referenceMondayUtc.getUTCDate() + (leg.dayOfWeek - 1),
      );
      legStart.setUTCHours(depHour, depMin, 0, 0);

      const legEnd = new Date(referenceMondayUtc);
      legEnd.setUTCDate(referenceMondayUtc.getUTCDate() + (leg.dayOfWeek - 1));
      legEnd.setUTCHours(arrHour, arrMin, 0, 0);

      if (legEnd.getTime() <= legStart.getTime()) {
        legEnd.setUTCDate(legEnd.getUTCDate() + 1);
      }

      const winStart = new Date(window.startAt).getTime();
      const winEnd = new Date(window.endAt).getTime();

      const overlap = Math.max(
        0,
        Math.min(legEnd.getTime(), winEnd) -
          Math.max(legStart.getTime(), winStart),
      );
      if (overlap > 0) {
        errors.push({
          code: "maintenance_collision",
          message: `Leg ${leg.id} overlaps with scheduled maintenance.`,
          affectedLegIds: [leg.id],
        });
      }
    });
  });

  if (legs.length === 0) {
    warnings.push({
      code: "empty_schedule",
      message: "Schedule has no legs defined.",
    });
  }

  void aircraftSpecs;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
