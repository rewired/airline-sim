import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { CanonicalAirport } from "../../domain/airport";
import type { ImportReport } from "./types";

// ---------------------------------------------------------------------------
// CSV serialiser (no external deps)
// ---------------------------------------------------------------------------
const CSV_COLUMNS: (keyof CanonicalAirport)[] = [
  "id",
  "sourceId",
  "ident",
  "icaoCode",
  "iataCode",
  "localCode",
  "name",
  "type",
  "municipality",
  "countryCode",
  "regionCode",
  "continent",
  "latitude",
  "longitude",
  "elevationFt",
  "scheduledService",
  "isAirlineRelevant",
  "timezone",
  "rawIdent",
];

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(airports: CanonicalAirport[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = airports.map((a) =>
    CSV_COLUMNS.map((col) => csvEscape(a[col])).join(",")
  );
  return [header, ...rows].join("\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export interface WriteOutputsOptions {
  outDir: string;
  normalized: CanonicalAirport[];
  airline: CanonicalAirport[];
  report: ImportReport;
}

export async function writeOutputs(opts: WriteOutputsOptions): Promise<void> {
  await mkdir(opts.outDir, { recursive: true });

  await Promise.all([
    writeFile(
      join(opts.outDir, "airports.normalized.json"),
      JSON.stringify(opts.normalized, null, 2),
      "utf-8"
    ),
    writeFile(
      join(opts.outDir, "airports.airline.json"),
      JSON.stringify(opts.airline, null, 2),
      "utf-8"
    ),
    writeFile(
      join(opts.outDir, "airports.report.json"),
      JSON.stringify(opts.report, null, 2),
      "utf-8"
    ),
    writeFile(
      join(opts.outDir, "airports.airline.csv"),
      toCsv(opts.airline),
      "utf-8"
    ),
  ]);
}
