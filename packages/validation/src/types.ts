export type ValidationIssueType =
  | "overlap"
  | "turnaround"
  | "range"
  | "maintenance_collision"
  | "tail_double_booked";

export interface ExplainableValidationResult {
  isValid: boolean;
  errors: Array<{
    code: ValidationIssueType;
    message: string;
    affectedLegIds?: string[];
  }>;
  warnings: Array<{
    code: string;
    message: string;
  }>;
}
