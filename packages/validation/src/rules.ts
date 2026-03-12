import {
  FlightLegPlan,
  AircraftType,
  MaintenanceWindow,
} from "@airline-sim/domain";
import {
  ExplainableValidationResult,
  ExplainableValidationIssue,
} from "./types";

export function validateSchedule(
  legs: FlightLegPlan[],
  aircraftSpecs: Record<string, AircraftType>,
  maintenanceWindows: MaintenanceWindow[],
): ExplainableValidationResult {
  const errors: ExplainableValidationIssue[] = [];
  const warnings: ExplainableValidationIssue[] = [];

  // Mock implementation for vertical slice:
  // 1. T020 Overlap Validation
  // 2. T021 Turnaround Minimum Validation
  // 3. T022 Range Validation
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
          rule: "maintenance_collision",
          severity: "error",
          message: `Leg ${leg.id} overlaps with scheduled maintenance.`,
          affectedLegIds: [leg.id],
          cause: {
            code: "TAIL_UNAVAILABLE_DURING_MAINTENANCE",
            description:
              "The assigned tail is blocked by a maintenance window at the planned departure/arrival time.",
          },
          recommendedAction: {
            code: "REASSIGN_OR_RESCHEDULE_LEG",
            action:
              "Move the leg outside the maintenance window or assign a different available tail.",
          },
        });
      }
    });
  });

  if (legs.length === 0) {
    warnings.push({
      rule: "empty_schedule",
      severity: "warning",
      message: "Schedule has no legs defined.",
      affectedLegIds: [],
      cause: {
        code: "NO_FLIGHT_LEGS_PLANNED",
        description:
          "The submitted plan does not contain any legs, so there is nothing to publish.",
      },
      recommendedAction: {
        code: "ADD_LEGS_BEFORE_PUBLISH",
        action:
          "Create at least one valid leg in the draft before publishing.",
      },
    });
  }

  void aircraftSpecs;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
