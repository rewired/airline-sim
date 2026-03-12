import type { CanonicalAirport } from "../../domain/airport";

/**
 * Returns only airports flagged as airline-relevant during normalization.
 *
 * The flag is set in normalizeAirportRow when:
 *  - scheduledService === true
 *  - at least one of icaoCode / iataCode / ident is non-null
 *
 * Type, coordinate, and name constraints are already enforced upstream during
 * normalization; this function is intentionally a thin filter so it stays
 * testable in isolation.
 */
export function filterAirlineAirports(
  airports: CanonicalAirport[]
): CanonicalAirport[] {
  return airports.filter((a) => a.isAirlineRelevant);
}
