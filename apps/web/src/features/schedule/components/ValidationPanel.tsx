import { ValidationIssue } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ValidationPanelProps {
  issues: ValidationIssue[];
}

export function ValidationPanel({ issues }: ValidationPanelProps) {
  const isHealthy = issues.length === 0;

  return (
    <Card
      className={`border-l-4 ${
        isHealthy ? "border-l-green-500" : "border-l-amber-500 bg-amber-500/5"
      }`}
    >
      <CardHeader className="py-4">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            Schedule Validation
            <Badge
              variant={isHealthy ? "outline" : "secondary"}
              className={
                isHealthy
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-amber-500/20 text-amber-500"
              }
            >
              {isHealthy ? "Valid" : `${issues.length} Issues`}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      {!isHealthy && (
        <CardContent className="space-y-3 pt-0">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex flex-col gap-2 p-3 bg-background border rounded-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-medium text-sm">{issue.message}</span>
                <Badge
                  variant={issue.severity === "error" ? "destructive" : "secondary"}
                  className="shrink-0"
                >
                  {issue.severity === "error" ? "Blocker" : "Warning"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex gap-2">
                Rule: {issue.rule} • Legs: {issue.affectedLegIds.join(", ") || "-"}
              </div>
              <div className="text-xs border rounded p-2 bg-muted/30 space-y-1">
                <div>
                  <span className="font-medium">Cause</span> ({issue.cause.code}): {" "}
                  {issue.cause.description}
                </div>
                <div>
                  <span className="font-medium">Countermeasure</span> ({issue.recommendedAction.code}): {" "}
                  {issue.recommendedAction.action}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
