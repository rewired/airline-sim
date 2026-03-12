import type { CanonicalAirport } from "../../domain/airport";

// ---------------------------------------------------------------------------
// Raw CSV row — one-to-one with the OurAirports airports.csv columns
// ---------------------------------------------------------------------------
export interface RawAirportRow {
  id: string;
  ident: string;
  type: string;
  name: string;
  latitude_deg: string;
  longitude_deg: string;
  elevation_ft: string;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  scheduled_service: string;
  icao_code: string;
  iata_code: string;
  gps_code: string;
  local_code: string;
  home_link: string;
  wikipedia_link: string;
  keywords: string;
}

// ---------------------------------------------------------------------------
// Rejection tracking
// ---------------------------------------------------------------------------
export type RejectionReason =
  | "invalid_type"
  | "invalid_coordinates"
  | "empty_name"
  | "parse_error"
  | "duplicate_icao";

export interface RejectedRow {
  sourceId: string;
  rawIdent: string | null;
  reason: RejectionReason;
  detail: string;
}

// ---------------------------------------------------------------------------
// Normalize outcome: either a canonical airport or a structured rejection
// ---------------------------------------------------------------------------
export type NormalizeOutcome =
  | { ok: true; airport: CanonicalAirport }
  | { ok: false; rejected: RejectedRow };

// ---------------------------------------------------------------------------
// Import report
// ---------------------------------------------------------------------------
export interface IcaoCollision {
  icaoCode: string;
  kept: string;       // sourceId of the record that was kept
  discarded: string[]; // sourceIds of removed duplicates
}

export interface ImportReport {
  totalRawRows: number;
  validRows: number;         // after normalization + dedup
  airlineRelevantRows: number;
  rejectedRows: number;
  rejectionsByReason: Record<string, number>;
  icaoCollisions: IcaoCollision[];
  generatedAt: string;
}
