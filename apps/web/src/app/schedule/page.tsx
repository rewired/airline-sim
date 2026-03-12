"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FlightTimeline } from "@/features/schedule/components/FlightTimeline";
import { ValidationPanel } from "@/features/schedule/components/ValidationPanel";
import {
  MOCK_TAILS,
  MOCK_LEGS,
  MOCK_ISSUES,
} from "@/features/schedule/mockData";
import { usePublishSchedule } from "@/features/schedule/hooks/usePublishSchedule";
import { useRoutes } from "@/features/network/hooks/useRoutes";
import { ScheduleDraftLeg } from "@/features/schedule/types";

function formatHHmm(dateIso: string) {
  const d = new Date(dateIso);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

function toIsoWeekDay(dateIso: string): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  const day = new Date(dateIso).getUTCDay();
  return (day === 0 ? 7 : day) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export default function ScheduleBuilderPage() {
  const [activeDate, setActiveDate] = useState("Today");
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

  const handlePublish = async () => {
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

      await publishMutation.mutateAsync({
        airlineId: "123",
        legs,
      });
      alert("Schedule published successfully!");
    } catch (err: any) {
      alert("Error publishing schedule: " + err.message);
    }
  };

  return (
    <main className="flex flex-col h-full bg-muted/20">
      <header className="bg-background border-b px-8 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Schedule Builder
          </h2>
          <p className="text-muted-foreground">
            Assign legs to tails and resolve operational constraints.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import Draft</Button>
          <Button
            onClick={handlePublish}
            disabled={publishMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {publishMutation.isPending ? "Publishing..." : "Publish to Ops"}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8 space-y-6 max-w-[1800px] w-full mx-auto">
        <ValidationPanel issues={MOCK_ISSUES} />

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
