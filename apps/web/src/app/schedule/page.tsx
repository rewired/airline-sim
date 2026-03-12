"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FlightTimeline } from "@/features/schedule/components/FlightTimeline";
import { ValidationPanel } from "@/features/schedule/components/ValidationPanel";
import { MOCK_TAILS, MOCK_LEGS, MOCK_ISSUES } from "@/features/schedule/mockData";
import { usePublishSchedule } from "@/features/schedule/hooks/usePublishSchedule";

export default function ScheduleBuilderPage() {
    const [activeDate, setActiveDate] = useState("Today");
    const publishMutation = usePublishSchedule();

    const handlePublish = async () => {
        try {
            await publishMutation.mutateAsync({
                airlineId: "123",
                legs: MOCK_LEGS.map(leg => ({
                    id: leg.id,
                    routeId: "r1", // mocked
                    dayOfWeek: 1,  // mocked
                    departureTimeLocal: "10:00", // mocked
                    arrivalTimeLocal: "14:00",   // mocked
                    plannedTailId: leg.assignedTailId,
                    plannedAircraftTypeId: "ac1" // mocked
                })) as any // Casting for MVP slice bypass
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
                    <h2 className="text-3xl font-bold tracking-tight">Schedule Builder</h2>
                    <p className="text-muted-foreground">Assign legs to tails and resolve operational constraints.</p>
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
