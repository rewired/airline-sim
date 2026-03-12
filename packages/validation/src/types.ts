export type ValidationIssueType =
  | "overlap"
  | "turnaround"
  | "range"
  | "maintenance_collision"
  | "tail_double_booked";

export type ValidationWarningType = "empty_schedule";

export interface ValidationCause {
  code: string;
  description: string;
}

export interface RecommendedAction {
  code: string;
  action: string;
}

export interface ExplainableValidationIssue {
  rule: ValidationIssueType | ValidationWarningType;
  severity: "error" | "warning";
  message: string;
  affectedLegIds: string[];
  cause: ValidationCause;
  recommendedAction: RecommendedAction;
}

export interface ExplainableValidationResult {
  isValid: boolean;
  errors: ExplainableValidationIssue[];
  warnings: ExplainableValidationIssue[];
}
