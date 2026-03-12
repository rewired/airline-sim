import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import type { CanonicalAirport } from "../../domain/airport";
import type { RawAirportRow, RejectedRow, ImportReport } from "./types";
import { normalizeAirportRow } from "./normalizeAirportRow";
import { filterAirlineAirports } from "./filterAirlineAirports";
import { dedupeAirports } from "./dedupeAirports";

// ---------------------------------------------------------------------------
// CSV parser — handles quoted fields and escaped double-quotes
// ---------------------------------------------------------------------------
export function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;

  while (i < line.length) {
    if (line[i] === '"') {
      // Quoted field
      let field = "";
      i++; // skip opening quote
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          // Escaped quote inside quoted field
          field += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++; // skip closing quote
          break;
        } else {
          field += line[i++];
        }
      }
      fields.push(field);
      if (line[i] === ",") i++; // skip trailing comma
    } else {
      // Unquoted field
      const end = line.indexOf(",", i);
      if (end === -1) {
        fields.push(line.slice(i));
        break;
      }
      fields.push(line.slice(i, end));
      i = end + 1;
    }
  }

  // Handle trailing comma → empty last field
  if (line.endsWith(",")) fields.push("");

  return fields;
}

// ---------------------------------------------------------------------------
// CSV file reader
// ---------------------------------------------------------------------------
async function readCsvRows(
  csvPath: string
): Promise<{ headers: string[]; rows: RawAirportRow[] }> {
  const rl = createInterface({
    input: createReadStream(csvPath, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  let headers: string[] = [];
  const rows: RawAirportRow[] = [];
  let lineIdx = 0;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const fields = parseCsvLine(trimmed);

    if (lineIdx === 0) {
      headers = fields.map((h) => h.trim());
    } else {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = fields[i] ?? "";
      });
      rows.push(obj as unknown as RawAirportRow);
    }
    lineIdx++;
  }

  return { headers, rows };
}

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------
export interface ImportAirportsResult {
  normalized: CanonicalAirport[];
  airline: CanonicalAirport[];
  report: ImportReport;
}

/**
 * Full import pipeline:
 *   read CSV → normalize → deduplicate → filter → report
 *
 * Idempotent: running multiple times against the same CSV always produces
 * the same output.
 */
export async function importAirports(
  csvPath: string
): Promise<ImportAirportsResult> {
  const { rows } = await readCsvRows(csvPath);
  const totalRawRows = rows.length;

  // ── 1. Normalize every row ─────────────────────────────────────────────────
  const normalized: CanonicalAirport[] = [];
  const rejected: RejectedRow[] = [];

  for (const row of rows) {
    const outcome = normalizeAirportRow(row);
    if (outcome.ok) {
      normalized.push(outcome.airport);
    } else {
      rejected.push(outcome.rejected);
    }
  }

  // ── 2. Deduplicate by ICAO ─────────────────────────────────────────────────
  const {
    airports: deduped,
    collisions,
    rejected: dupeRejected,
  } = dedupeAirports(normalized);

  const allRejected = [...rejected, ...dupeRejected];

  // ── 3. Filter airline-relevant ─────────────────────────────────────────────
  const airline = filterAirlineAirports(deduped);

  // ── 4. Build report ────────────────────────────────────────────────────────
  const rejectionsByReason: Record<string, number> = {};
  for (const r of allRejected) {
    rejectionsByReason[r.reason] = (rejectionsByReason[r.reason] ?? 0) + 1;
  }

  const report: ImportReport = {
    totalRawRows,
    validRows: deduped.length,
    airlineRelevantRows: airline.length,
    rejectedRows: allRejected.length,
    rejectionsByReason,
    icaoCollisions: collisions,
    generatedAt: new Date().toISOString(),
  };

  return { normalized: deduped, airline, report };
}
