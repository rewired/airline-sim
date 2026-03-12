import { z } from "zod";

export type AirportId = string;

export const ALLOWED_AIRPORT_TYPES = [
  "large_airport",
  "medium_airport",
  "small_airport",
] as const;

export type AirportType = (typeof ALLOWED_AIRPORT_TYPES)[number];

export const CanonicalAirportSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  ident: z.string().nullable(),
  icaoCode: z.string().nullable(),
  iataCode: z.string().nullable(),
  localCode: z.string().nullable(),
  name: z.string(),
  type: z.enum(ALLOWED_AIRPORT_TYPES),
  municipality: z.string().nullable(),
  countryCode: z.string().nullable(),
  regionCode: z.string().nullable(),
  continent: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  elevationFt: z.number().nullable(),
  scheduledService: z.boolean(),
  isAirlineRelevant: z.boolean(),
  timezone: z.string().nullable(),
  rawIdent: z.string().nullable(),
});

export type CanonicalAirport = z.infer<typeof CanonicalAirportSchema>;
