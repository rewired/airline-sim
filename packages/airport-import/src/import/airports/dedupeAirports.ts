import type { CanonicalAirport } from "../../domain/airport";
import type { IcaoCollision, RejectedRow } from "./types";

// ---------------------------------------------------------------------------
// Scoring — prefers records with more usable fields
// ---------------------------------------------------------------------------
function score(a: CanonicalAirport): number {
  let n = 0;
  if (a.icaoCode) n++;
  if (a.iataCode) n++;
  if (a.localCode) n++;
  if (a.ident) n++;
  if (a.municipality) n++;
  if (a.elevationFt !== null) n++;
  if (a.scheduledService) n += 2; // strongly prefer scheduled airports
  return n;
}

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------
export interface DedupeResult {
  airports: CanonicalAirport[];
  collisions: IcaoCollision[];
  rejected: RejectedRow[];
}

/**
 * Removes duplicate airports that share the same ICAO code.
 *
 * Strategy:
 *  - Group by icaoCode
 *  - If only one record per ICAO → keep it
 *  - If multiple → keep the highest-scored one, record a collision
 *  - Airports with no ICAO code are never deduplicated (kept as-is)
 */
export function dedupeAirports(airports: CanonicalAirport[]): DedupeResult {
  const byIcao = new Map<string, CanonicalAirport[]>();
  const noIcao: CanonicalAirport[] = [];

  for (const airport of airports) {
    if (airport.icaoCode) {
      const group = byIcao.get(airport.icaoCode) ?? [];
      group.push(airport);
      byIcao.set(airport.icaoCode, group);
    } else {
      noIcao.push(airport);
    }
  }

  const result: CanonicalAirport[] = [...noIcao];
  const collisions: IcaoCollision[] = [];
  const rejected: RejectedRow[] = [];

  for (const [icao, group] of byIcao.entries()) {
    if (group.length === 1) {
      result.push(group[0]);
      continue;
    }

    // Sort descending by score; stable sort preserves CSV order as tiebreaker
    const sorted = [...group].sort((a, b) => score(b) - score(a));
    const kept = sorted[0];
    const discarded = sorted.slice(1);

    result.push(kept);

    collisions.push({
      icaoCode: icao,
      kept: kept.sourceId,
      discarded: discarded.map((d) => d.sourceId),
    });

    for (const d of discarded) {
      rejected.push({
        sourceId: d.sourceId,
        rawIdent: d.rawIdent,
        reason: "duplicate_icao",
        detail: `ICAO ${icao} retained by sourceId=${kept.sourceId}`,
      });
    }
  }

  return { airports: result, collisions, rejected };
}
