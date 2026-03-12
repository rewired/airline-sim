import { Airport } from "@airline-sim/domain";

export interface FlightLegDraft {
  id: string;
  flightNumber: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTimeUtc: string; // ISO 8601
  arrivalTimeUtc: string; // ISO 8601
  assignedTailId: string | null;
  state: "draft" | "published";
}

export interface ScheduleDraftLeg {
  id: string;
  routeRef: {
    originAirportId: string;
    destinationAirportId: string;
  };
  departureTimeUtc: string;
  arrivalTimeUtc: string;
  plannedTailId: string | null;
  plannedAircraftTypeId: string;
}

export interface ValidationIssue {
  id: string;
  rule: string;
  severity: "error" | "warning";
  message: string;
  affectedLegIds: string[];
  cause: {
    code: string;
    description: string;
  };
  recommendedAction: {
    code: string;
    action: string;
  };
}

export interface DiffSummary {
  addedLegs: number;
  removedLegs: number;
  movedLegs: number;
  tailChanges: number;
}

export interface SchedulePublishResponse {
  success: boolean;
  count?: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  diffSummary: DiffSummary;
}
