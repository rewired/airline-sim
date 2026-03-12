import { describe, it, expect } from "vitest";
import { filterAirlineAirports } from "../filterAirlineAirports";
import type { CanonicalAirport } from "../../../../domain/airport";

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
function makeAirport(overrides: Partial<CanonicalAirport> = {}): CanonicalAirport {
  return {
    id: "airport:EDDF",
    sourceId: "1",
    ident: "EDDF",
    icaoCode: "EDDF",
    iataCode: "FRA",
    localCode: null,
    name: "Frankfurt Airport",
    type: "large_airport",
    municipality: "Frankfurt",
    countryCode: "DE",
    regionCode: "DE-HE",
    continent: "EU",
    latitude: 50.033333,
    longitude: 8.570556,
    elevationFt: 364,
    scheduledService: true,
    isAirlineRelevant: true,
    timezone: null,
    rawIdent: "EDDF",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("filterAirlineAirports", () => {
  it("includes airports with isAirlineRelevant=true", () => {
    const airports = [makeAirport({ isAirlineRelevant: true })];
    expect(filterAirlineAirports(airports)).toHaveLength(1);
  });

  it("excludes airports with isAirlineRelevant=false", () => {
    const airports = [makeAirport({ isAirlineRelevant: false })];
    expect(filterAirlineAirports(airports)).toHaveLength(0);
  });

  it("handles an empty input array", () => {
    expect(filterAirlineAirports([])).toHaveLength(0);
  });

  it("filters a mixed list and preserves order", () => {
    const airports = [
      makeAirport({ id: "airport:EDDF", sourceId: "1", isAirlineRelevant: true }),
      makeAirport({ id: "airport:EDDM", sourceId: "2", isAirlineRelevant: false }),
      makeAirport({ id: "airport:EDDB", sourceId: "3", isAirlineRelevant: true }),
      makeAirport({ id: "airport:EDDS", sourceId: "4", isAirlineRelevant: false }),
    ];

    const result = filterAirlineAirports(airports);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("airport:EDDF");
    expect(result[1].id).toBe("airport:EDDB");
  });

  it("does not mutate the original array", () => {
    const airports = [
      makeAirport({ isAirlineRelevant: true }),
      makeAirport({ id: "airport:EDDM", isAirlineRelevant: false }),
    ];
    const original = [...airports];
    filterAirlineAirports(airports);
    expect(airports).toEqual(original);
  });
});
