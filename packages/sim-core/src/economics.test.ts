import { describe, it, expect } from "vitest";
import { calculateRouteEconomics } from "./economics";
import { Route, Airport, AircraftType } from "@airline-sim/domain";

describe("Route Economics BaseModel", () => {
    it("should calculate basic route economics correctly", () => {
        const mockRoute: Route = { id: "r1", airlineId: "a1", originAirportId: "JFK", destinationAirportId: "LHR", weeklyDemand: 500, competitionScore: 0.5, strategicRole: "trunk" };
        const origin: Airport = { id: "JFK", iata: "JFK", name: "JFK", demandScore: 90, slotPressure: 80, weatherRisk: 50, feeLevel: 2, transferQuality: 5 };
        const dest: Airport = { id: "LHR", iata: "LHR", name: "LHR", demandScore: 95, slotPressure: 90, weatherRisk: 60, feeLevel: 3, transferQuality: 4 };
        const aircraft: AircraftType = { id: "a320", code: "A320", seats: 180, rangeKm: 6000, minTurnaroundMin: 45, costPerBlockHour: 3500, reliabilityBase: 99 };

        const result = calculateRouteEconomics(mockRoute, origin, dest, aircraft, 7, 400);

        expect(result.routeId).toBe("r1");
        expect(result.revenue).toBeGreaterThan(0);
        expect(result.directCost).toBeGreaterThan(0);
        expect(result.loadFactor).toBeGreaterThan(0);
        expect(result.loadFactor).toBeLessThanOrEqual(1);
    });
});
