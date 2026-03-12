import { ALLOWED_AIRPORT_TYPES } from "../../domain/airport";
import type { CanonicalAirport } from "../../domain/airport";
import type { RawAirportRow, NormalizeOutcome } from "./types";

// ---------------------------------------------------------------------------
// Primitive helpers — all pure, no side effects
// ---------------------------------------------------------------------------

/** Trim and return null for blank strings */
function s(value: string | undefined): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

/** Parse a numeric string; returns null if blank or NaN */
function parseNum(value: string | undefined): number | null {
  const trimmed = (value ?? "").trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return isNaN(n) ? null : n;
}

/** Normalise the scheduled_service field to a boolean */
function parseScheduledService(value: string | undefined): boolean {
  return (value ?? "").trim().toLowerCase() === "yes";
}

/**
 * Derive a stable internal ID.
 * Preference: icao_code → gps_code → ident → src:<sourceId>
 */
function deriveId(row: RawAirportRow): string {
  const code = s(row.icao_code) ?? s(row.gps_code) ?? s(row.ident);
  if (code) return `airport:${code}`;
  return `airport:src:${row.id}`;
}

// ---------------------------------------------------------------------------
// Main normalizer
// ---------------------------------------------------------------------------

export function normalizeAirportRow(row: RawAirportRow): NormalizeOutcome {
  const sourceId = (row.id ?? "").trim();
  const rawIdent = s(row.ident);

  // ── 1. Type guard ─────────────────────────────────────────────────────────
  const rawType = s(row.type) ?? "";
  if (!(ALLOWED_AIRPORT_TYPES as readonly string[]).includes(rawType)) {
    return {
      ok: false,
      rejected: {
        sourceId,
        rawIdent,
        reason: "invalid_type",
        detail: `type="${rawType}"`,
      },
    };
  }
  const type = rawType as CanonicalAirport["type"];

  // ── 2. Coordinates ────────────────────────────────────────────────────────
  const latitude = parseNum(row.latitude_deg);
  const longitude = parseNum(row.longitude_deg);
  if (latitude === null || longitude === null) {
    return {
      ok: false,
      rejected: {
        sourceId,
        rawIdent,
        reason: "invalid_coordinates",
        detail: `lat="${row.latitude_deg}" lon="${row.longitude_deg}"`,
      },
    };
  }

  // ── 3. Name ───────────────────────────────────────────────────────────────
  const name = s(row.name);
  if (!name) {
    return {
      ok: false,
      rejected: {
        sourceId,
        rawIdent,
        reason: "empty_name",
        detail: "name field is empty",
      },
    };
  }

  // ── 4. Codes ──────────────────────────────────────────────────────────────
  // icaoCode: prefer explicit icao_code, fall back to gps_code
  const icaoCode = s(row.icao_code) ?? s(row.gps_code);
  const iataCode = s(row.iata_code);
  const localCode = s(row.local_code);
  const ident = s(row.ident);

  // ── 5. Airline-relevance flag ─────────────────────────────────────────────
  const scheduledService = parseScheduledService(row.scheduled_service);
  const hasCode = !!(icaoCode || iataCode || ident);
  const isAirlineRelevant = scheduledService && hasCode;

  // ── 6. Assemble canonical record ──────────────────────────────────────────
  const airport: CanonicalAirport = {
    id: deriveId(row),
    sourceId,
    ident,
    icaoCode,
    iataCode,
    localCode,
    name,
    type,
    municipality: s(row.municipality),
    countryCode: s(row.iso_country),
    regionCode: s(row.iso_region),
    continent: s(row.continent),
    latitude,
    longitude,
    elevationFt: parseNum(row.elevation_ft),
    scheduledService,
    isAirlineRelevant,
    timezone: null, // not present in source; reserved for enrichment
    rawIdent: s(row.ident),
  };

  return { ok: true, airport };
}
