import { describe, it, expect } from "vitest";
import { normalizeAirportRow } from "../normalizeAirportRow";
import type { RawAirportRow } from "../types";

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
function makeRow(overrides: Partial<RawAirportRow> = {}): RawAirportRow {
  return {
    id: "123",
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("normalizeAirportRow", () => {
  describe("happy path", () => {
    it("normalizes a fully filled valid row", () => {
      const result = normalizeAirportRow(makeRow());
      expect(result.ok).toBe(true);
      if (!result.ok) return;

      const { airport } = result;
      expect(airport.name).toBe("Frankfurt Airport");
      expect(airport.icaoCode).toBe("EDDF");
      expect(airport.iataCode).toBe("FRA");
      expect(airport.scheduledService).toBe(true);
      expect(airport.latitude).toBe(50.033333);
      expect(airport.longitude).toBe(8.570556);
      expect(airport.elevationFt).toBe(364);
      expect(airport.countryCode).toBe("DE");
      expect(airport.continent).toBe("EU");
      expect(airport.timezone).toBeNull();
    });

    it("sets isAirlineRelevant=true when scheduled + codes present", () => {
      const result = normalizeAirportRow(makeRow());
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.isAirlineRelevant).toBe(true);
    });

    it("sets isAirlineRelevant=false when not scheduled", () => {
      const result = normalizeAirportRow(makeRow({ scheduled_service: "no" }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.isAirlineRelevant).toBe(false);
    });

    it("sets isAirlineRelevant=false when no codes at all", () => {
      const result = normalizeAirportRow(
        makeRow({ icao_code: "", iata_code: "", gps_code: "", ident: "" })
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.isAirlineRelevant).toBe(false);
    });
  });

  describe("string normalisation", () => {
    it("trims whitespace from name", () => {
      const result = normalizeAirportRow(makeRow({ name: "  Frankfurt Airport  " }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.name).toBe("Frankfurt Airport");
    });

    it("converts blank local_code to null", () => {
      const result = normalizeAirportRow(makeRow({ local_code: "  " }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.localCode).toBeNull();
    });

    it("converts blank municipality to null", () => {
      const result = normalizeAirportRow(makeRow({ municipality: "" }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.municipality).toBeNull();
    });

    it("converts blank iata_code to null", () => {
      const result = normalizeAirportRow(makeRow({ iata_code: "" }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.iataCode).toBeNull();
    });
  });

  describe("scheduled_service normalisation", () => {
    it("parses 'yes' as true", () => {
      const result = normalizeAirportRow(makeRow({ scheduled_service: "yes" }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.scheduledService).toBe(true);
    });

    it("parses 'no' as false", () => {
      const result = normalizeAirportRow(makeRow({ scheduled_service: "no" }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.scheduledService).toBe(false);
    });

    it("parses empty string as false", () => {
      const result = normalizeAirportRow(makeRow({ scheduled_service: "" }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.scheduledService).toBe(false);
    });

    it("parses 'YES' (uppercase) as true", () => {
      const result = normalizeAirportRow(makeRow({ scheduled_service: "YES" }));
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.scheduledService).toBe(true);
    });
  });

  describe("ID derivation", () => {
    it("prefers icao_code for id", () => {
      const result = normalizeAirportRow(
        makeRow({ icao_code: "EDDF", gps_code: "KXXX", ident: "00AA" })
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.id).toBe("airport:EDDF");
    });

    it("falls back to gps_code when icao_code is empty", () => {
      const result = normalizeAirportRow(
        makeRow({ icao_code: "", gps_code: "KLAX", ident: "LAX" })
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.id).toBe("airport:KLAX");
    });

    it("falls back to ident when both icao and gps are empty", () => {
      const result = normalizeAirportRow(
        makeRow({ icao_code: "", gps_code: "", ident: "00AA" })
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.id).toBe("airport:00AA");
    });

    it("falls back to src:<sourceId> when no codes present", () => {
      const result = normalizeAirportRow(
        makeRow({ id: "999", icao_code: "", gps_code: "", ident: "" })
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.id).toBe("airport:src:999");
    });
  });

  describe("rejections", () => {
    it("rejects heliport type", () => {
      const result = normalizeAirportRow(makeRow({ type: "heliport" }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.reason).toBe("invalid_type");
      expect(result.rejected.detail).toContain("heliport");
    });

    it("rejects seaplane_base type", () => {
      const result = normalizeAirportRow(makeRow({ type: "seaplane_base" }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.reason).toBe("invalid_type");
    });

    it("rejects closed type", () => {
      const result = normalizeAirportRow(makeRow({ type: "closed" }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.reason).toBe("invalid_type");
    });

    it("rejects balloonport type", () => {
      const result = normalizeAirportRow(makeRow({ type: "balloonport" }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.reason).toBe("invalid_type");
    });

    it("rejects row with non-numeric latitude", () => {
      const result = normalizeAirportRow(makeRow({ latitude_deg: "not-a-number" }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.reason).toBe("invalid_coordinates");
    });

    it("rejects row with empty longitude", () => {
      const result = normalizeAirportRow(makeRow({ longitude_deg: "" }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.reason).toBe("invalid_coordinates");
    });

    it("rejects row with empty name", () => {
      const result = normalizeAirportRow(makeRow({ name: "   " }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.reason).toBe("empty_name");
    });

    it("stores correct sourceId and rawIdent in rejection", () => {
      const result = normalizeAirportRow(makeRow({ id: "42", ident: "TEST", type: "closed" }));
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.rejected.sourceId).toBe("42");
      expect(result.rejected.rawIdent).toBe("TEST");
    });
  });

  describe("icaoCode fallback", () => {
    it("uses gps_code as icaoCode when icao_code is missing", () => {
      const result = normalizeAirportRow(
        makeRow({ icao_code: "", gps_code: "KLAX" })
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.icaoCode).toBe("KLAX");
    });

    it("prefers icao_code over gps_code for icaoCode", () => {
      const result = normalizeAirportRow(
        makeRow({ icao_code: "EDDF", gps_code: "KXXX" })
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.airport.icaoCode).toBe("EDDF");
    });
  });
});
