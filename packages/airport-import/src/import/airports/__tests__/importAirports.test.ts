import { describe, it, expect } from "vitest";
import { parseCsvLine } from "../importAirports";

// ---------------------------------------------------------------------------
// CSV parser unit tests (the parser is exported for testability)
// ---------------------------------------------------------------------------
describe("parseCsvLine", () => {
  it("parses a simple comma-separated line", () => {
    expect(parseCsvLine("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("parses a quoted field containing a comma", () => {
    expect(parseCsvLine('"Frankfurt, Main",DE,EU')).toEqual([
      "Frankfurt, Main",
      "DE",
      "EU",
    ]);
  });

  it("unescapes doubled quotes inside a quoted field", () => {
    expect(parseCsvLine('"He said ""hello""",world')).toEqual([
      'He said "hello"',
      "world",
    ]);
  });

  it("handles empty fields", () => {
    expect(parseCsvLine("a,,c")).toEqual(["a", "", "c"]);
  });

  it("handles a fully empty line", () => {
    expect(parseCsvLine("")).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Inline pipeline integration test (no file I/O)
// ---------------------------------------------------------------------------
import { normalizeAirportRow } from "../normalizeAirportRow";
import { dedupeAirports } from "../dedupeAirports";
import { filterAirlineAirports } from "../filterAirlineAirports";
import type { RawAirportRow } from "../types";

function makeRow(overrides: Partial<RawAirportRow> = {}): RawAirportRow {
  return {
    id: "1",
    ident: "EDDF",
    type: "large_airport",
    name: "Frankfurt Airport",
    latitude_deg: "50.033333",
    longitude_deg: "8.570556",
    elevation_ft: "364",
    continent: "EU",
    iso_country: "DE",
    iso_region: "DE-HE",
    municipality: "Frankfurt am Main",
    scheduled_service: "yes",
    icao_code: "EDDF",
    iata_code: "FRA",
    gps_code: "EDDF",
    local_code: "",
    home_link: "",
    wikipedia_link: "",
    keywords: "",
    ...overrides,
  };
}

describe("pipeline integration", () => {
  it("normalizes → dedupes → filters a clean dataset without loss", () => {
    const rows = [
      makeRow({ id: "1", icao_code: "EDDF", name: "Frankfurt" }),
      makeRow({ id: "2", icao_code: "EDDM", name: "Munich", iata_code: "MUC" }),
    ];

    const normalized = rows.flatMap((r) => {
      const o = normalizeAirportRow(r);
      return o.ok ? [o.airport] : [];
    });

    const { airports: deduped } = dedupeAirports(normalized);
    const airline = filterAirlineAirports(deduped);

    expect(deduped).toHaveLength(2);
    expect(airline).toHaveLength(2);
  });

  it("drops heliports and keeps only scheduled airports", () => {
    const rows = [
      makeRow({ id: "1", icao_code: "EDDF", name: "Frankfurt" }),
      makeRow({ id: "2", type: "heliport", icao_code: "HELI", name: "Helipad" }),
      makeRow({ id: "3", icao_code: "EDDM", scheduled_service: "no", name: "Munich" }),
    ];

    const normalized = rows.flatMap((r) => {
      const o = normalizeAirportRow(r);
      return o.ok ? [o.airport] : [];
    });
    const { airports: deduped } = dedupeAirports(normalized);
    const airline = filterAirlineAirports(deduped);

    // heliport rejected, Munich not scheduled → only Frankfurt passes
    expect(deduped).toHaveLength(2); // Frankfurt + Munich in normalized
    expect(airline).toHaveLength(1);
    expect(airline[0].icaoCode).toBe("EDDF");
  });

  it("deduplicates duplicate ICAO codes and includes collision in report", () => {
    const rows = [
      makeRow({ id: "1", icao_code: "EDDF", iata_code: "FRA" }),
      makeRow({ id: "2", icao_code: "EDDF", iata_code: null as unknown as string }),
    ];

    const normalized = rows.flatMap((r) => {
      const o = normalizeAirportRow(r);
      return o.ok ? [o.airport] : [];
    });
    const { airports: deduped, collisions } = dedupeAirports(normalized);

    expect(deduped).toHaveLength(1);
    expect(collisions).toHaveLength(1);
    expect(collisions[0].kept).toBe("1");
  });
});
