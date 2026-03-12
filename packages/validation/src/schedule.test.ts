import { describe, it, expect } from "vitest";
import { validateSchedule } from "./rules";
import {
  FlightLegPlan,
  AircraftType,
  MaintenanceWindow,
} from "@airline-sim/domain";

describe("Schedule Validation", () => {
  it("should return valid with warnings if schedule is empty", () => {
    const legs: FlightLegPlan[] = [];
    const aircraft: Record<string, AircraftType> = {};
    const maintenance: MaintenanceWindow[] = [];

    const result = validateSchedule(legs, aircraft, maintenance);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].rule).toBe("empty_schedule");
    expect(result.warnings[0].cause.code).toBe("NO_FLIGHT_LEGS_PLANNED");
    expect(result.warnings[0].recommendedAction.code).toBe(
      "ADD_LEGS_BEFORE_PUBLISH",
    );
  });

  it("should return valid for a basic schedule", () => {
    const legs: FlightLegPlan[] = [
      {
        id: "l1",
        routeId: "r1",
        dayOfWeek: 1,
        departureTimeLocal: "10:00",
        arrivalTimeLocal: "20:00",
        plannedTailId: "t1",
        plannedAircraftTypeId: "a320",
      },
    ];
    const aircraft: Record<string, AircraftType> = {
      a320: {
        id: "a320",
        code: "A320",
        seats: 180,
        rangeKm: 6000,
        minTurnaroundMin: 45,
        costPerBlockHour: 3500,
        reliabilityBase: 99,
      },
    };
    const maintenance: MaintenanceWindow[] = [];

    const result = validateSchedule(legs, aircraft, maintenance);

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
