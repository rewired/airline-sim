"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FlightTimeline } from "@/features/schedule/components/FlightTimeline";
import { ValidationPanel } from "@/features/schedule/components/ValidationPanel";
import { MOCK_TAILS, MOCK_LEGS, MOCK_ISSUES } from "@/features/schedule/mockData";
import { usePublishSchedule } from "@/features/schedule/hooks/usePublishSchedule";
import { useRoutes } from "@/features/network/hooks/useRoutes";
import {
  ScheduleDraftLeg,
  DiffSummary,
  ValidationIssue,
} from "@/features/schedule/types";

function formatHHmm(dateIso: string) {
  const d = new Date(dateIso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

function toIsoWeekDay(dateIso: string): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  const day = new Date(dateIso).getUTCDay();
  return (day === 0 ? 7 : day) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

function summarizeDraftDiff(
  baselineLegs: ScheduleDraftLeg[],
  draftLegs: ScheduleDraftLeg[],
): DiffSummary {
  const baselineById = new Map(baselineLegs.map((leg) => [leg.id, leg]));
  const draftById = new Map(draftLegs.map((leg) => [leg.id, leg]));

  const addedLegs = draftLegs.filter((leg) => !baselineById.has(leg.id)).length;
  const removedLegs = baselineLegs.filter((leg) => !draftById.has(leg.id)).length;

  const movedLegs = draftLegs.filter((leg) => {
    const baseline = baselineById.get(leg.id);
    if (!baseline) return false;
    return (
      baseline.departureTimeUtc !== leg.departureTimeUtc ||
      baseline.arrivalTimeUtc !== leg.arrivalTimeUtc
    );
  }).length;

  const tailChanges = draftLegs.filter((leg) => {
    const baseline = baselineById.get(leg.id);
    if (!baseline) return false;
    return baseline.plannedTailId !== leg.plannedTailId;
  }).length;

  return { addedLegs, removedLegs, movedLegs, tailChanges };
}

export default function ScheduleBuilderPage() {
  const [activeDate] = useState("Today");
  const [diffReviewed, setDiffReviewed] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>(
    MOCK_ISSUES,
  );
  const [serverDiffSummary, setServerDiffSummary] = useState<DiffSummary | null>(
    null,
  );

  const publishMutation = usePublishSchedule();
  const { data: routes = [] } = useRoutes("123");

  const [draftLegs] = useState<ScheduleDraftLeg[]>(
    MOCK_LEGS.map((leg) => ({
      id: leg.id,
      routeRef: {
        originAirportId: leg.departureAirport.id,
        destinationAirportId: leg.arrivalAirport.id,
      },
      departureTimeUtc: leg.departureTimeUtc,
      arrivalTimeUtc: leg.arrivalTimeUtc,
      plannedTailId: leg.assignedTailId,
      plannedAircraftTypeId: "ac1",
    })),
  );

  const baselineLegs = useMemo(() => draftLegs, [draftLegs]);
  const localDiffSummary = useMemo(
    () => summarizeDraftDiff(baselineLegs, draftLegs),
    [baselineLegs, draftLegs],
  );

  const handlePublish = async () => {
    if (!diffReviewed) {
      alert("Please review and confirm the diff summary before publishing.");
      return;
    }

    try {
      const legs = draftLegs.map((draftLeg) => {
        const route = routes.find(
          (r: any) =>
            r.originAirportId === draftLeg.routeRef.originAirportId &&
            r.destinationAirportId === draftLeg.routeRef.destinationAirportId,
        );

        if (!route) {
          throw new Error(
            `Missing route for ${draftLeg.routeRef.originAirportId}→${draftLeg.routeRef.destinationAirportId}. Create route in Network Planner first.`,
          );
        }

        return {
          id: draftLeg.id,
          routeId: route.id,
          dayOfWeek: toIsoWeekDay(draftLeg.departureTimeUtc),
          departureTimeLocal: formatHHmm(draftLeg.departureTimeUtc),
          arrivalTimeLocal: formatHHmm(draftLeg.arrivalTimeUtc),
          plannedTailId: draftLeg.plannedTailId,
          plannedAircraftTypeId: draftLeg.plannedAircraftTypeId,
        };
      });

      const response = await publishMutation.mutateAsync({
        airlineId: "123",
        legs,
      });
      setValidationIssues([...response.errors, ...response.warnings]);
      setServerDiffSummary(response.diffSummary);
      alert("Schedule published successfully!");
    } catch (err: any) {
      if (err?.errors || err?.warnings) {
        setValidationIssues([...(err.errors || []), ...(err.warnings || [])]);
        if (err.diffSummary) setServerDiffSummary(err.diffSummary);
      }
      alert("Error publishing schedule: " + (err?.message || "Validation failed"));
    }
  };

  const effectiveDiff = serverDiffSummary || localDiffSummary;

  return (
    <main className="flex flex-col h-full bg-muted/20">
      <header className="bg-background border-b px-8 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schedule Builder</h2>
          <p className="text-muted-foreground">
            Assign legs to tails and resolve operational constraints.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import Draft</Button>
          <Button
            onClick={handlePublish}
            disabled={publishMutation.isPending || !diffReviewed}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {publishMutation.isPending ? "Publishing..." : "Publish to Ops"}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8 space-y-6 max-w-[1800px] w-full mx-auto">
        <ValidationPanel issues={validationIssues} />

        <div className="rounded-xl border bg-background p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Mandatory Diff Check before Publish</h3>
            <Button variant="outline" size="sm" onClick={() => setDiffReviewed(true)}>
              Mark Diff as Reviewed
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="border rounded-md p-3">New Legs: <span className="font-semibold">{effectiveDiff.addedLegs}</span></div>
            <div className="border rounded-md p-3">Removed Legs: <span className="font-semibold">{effectiveDiff.removedLegs}</span></div>
            <div className="border rounded-md p-3">Moved Legs: <span className="font-semibold">{effectiveDiff.movedLegs}</span></div>
            <div className="border rounded-md p-3">Tail Changes: <span className="font-semibold">{effectiveDiff.tailChanges}</span></div>
          </div>
          {!diffReviewed && (
            <p className="text-xs text-amber-600">
              Publishing is locked until this diff step is explicitly reviewed.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-semibold">Tail Assignments</h3>
            <div className="text-sm font-medium border rounded-md px-3 py-1.5 bg-background">
              Draft Target: <span className="text-primary">{activeDate}</span>
            </div>
          </div>
          <FlightTimeline tails={MOCK_TAILS} legs={MOCK_LEGS} />
        </div>
      </div>
    </main>
  );
}
