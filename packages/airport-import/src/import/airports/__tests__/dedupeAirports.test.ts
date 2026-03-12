import { describe, it, expect } from "vitest";
import { dedupeAirports } from "../dedupeAirports";
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
describe("dedupeAirports", () => {
  it("passes through a list with unique ICAO codes unchanged", () => {
    const airports = [
      makeAirport({ sourceId: "1", icaoCode: "EDDF", id: "airport:EDDF" }),
      makeAirport({ sourceId: "2", icaoCode: "EDDM", id: "airport:EDDM" }),
    ];

    const result = dedupeAirports(airports);

    expect(result.airports).toHaveLength(2);
    expect(result.collisions).toHaveLength(0);
    expect(result.rejected).toHaveLength(0);
  });

  it("keeps all airports without an ICAO code (no dedup)", () => {
    const airports = [
      makeAirport({ sourceId: "1", icaoCode: null, id: "airport:src:1" }),
      makeAirport({ sourceId: "2", icaoCode: null, id: "airport:src:2" }),
    ];

    const result = dedupeAirports(airports);

    expect(result.airports).toHaveLength(2);
    expect(result.collisions).toHaveLength(0);
  });

  it("keeps the better-scored record on ICAO collision", () => {
    const full = makeAirport({
      sourceId: "1",
      icaoCode: "EDDF",
      iataCode: "FRA",
      localCode: "FRA",
      scheduledService: true,
    });
    const sparse = makeAirport({
      sourceId: "2",
      icaoCode: "EDDF",
      iataCode: null,
      localCode: null,
      scheduledService: false,
    });

    const result = dedupeAirports([full, sparse]);

    expect(result.airports).toHaveLength(1);
    expect(result.airports[0].sourceId).toBe("1"); // better record kept
  });

  it("records the collision with correct kept/discarded sourceIds", () => {
    const a = makeAirport({ sourceId: "1", icaoCode: "EDDF" });
    const b = makeAirport({
      sourceId: "2",
      icaoCode: "EDDF",
      iataCode: null,
      scheduledService: false,
    });

    const result = dedupeAirports([a, b]);

    expect(result.collisions).toHaveLength(1);
    expect(result.collisions[0].icaoCode).toBe("EDDF");
    expect(result.collisions[0].kept).toBe("1");
    expect(result.collisions[0].discarded).toContain("2");
  });

  it("adds discarded records to rejected list with reason duplicate_icao", () => {
    const a = makeAirport({ sourceId: "1", icaoCode: "EDDF" });
    const b = makeAirport({
      sourceId: "2",
      icaoCode: "EDDF",
      iataCode: null,
      scheduledService: false,
    });

    const result = dedupeAirports([a, b]);

    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].sourceId).toBe("2");
    expect(result.rejected[0].reason).toBe("duplicate_icao");
  });

  it("handles three-way ICAO collision correctly", () => {
    const best = makeAirport({
      sourceId: "1",
      icaoCode: "EDDF",
      iataCode: "FRA",
      localCode: "X",
      scheduledService: true,
    });
    const medium = makeAirport({
      sourceId: "2",
      icaoCode: "EDDF",
      iataCode: "FRA",
      localCode: null,
      scheduledService: true,
    });
    const worst = makeAirport({
      sourceId: "3",
      icaoCode: "EDDF",
      iataCode: null,
      localCode: null,
      scheduledService: false,
    });

    const result = dedupeAirports([best, medium, worst]);

    expect(result.airports).toHaveLength(1);
    expect(result.airports[0].sourceId).toBe("1");
    expect(result.rejected).toHaveLength(2);
    expect(result.collisions[0].discarded).toHaveLength(2);
  });

  it("does not mutate input array", () => {
    const airports = [
      makeAirport({ sourceId: "1", icaoCode: "EDDF" }),
      makeAirport({ sourceId: "2", icaoCode: "EDDF", iataCode: null, scheduledService: false }),
    ];
    const original = airports.length;
    dedupeAirports(airports);
    expect(airports).toHaveLength(original);
  });
});
