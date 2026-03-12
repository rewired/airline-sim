"use client";

import { useState } from "react";
import { CandidateTable } from "@/features/network/components/CandidateTable";
import { RouteSimulationDrawer } from "@/features/network/components/RouteSimulationDrawer";
import { MOCK_CANDIDATES } from "@/features/network/mockData";
import { RouteCandidate } from "@/features/network/types";
import { Button } from "@/components/ui/button";

import { useRoutes } from "@/features/network/hooks/useRoutes";

export default function NetworkPlannerPage() {
    const [activeCandidate, setActiveCandidate] = useState<RouteCandidate | null>(null);
    const { data: activeRoutes, isLoading: isRoutesLoading } = useRoutes();

    return (
        <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Network Planner</h2>
                    <p className="text-muted-foreground">Identify demand and evaluate new route opportunities.</p>
                </div>
                <Button>Evaluate Custom Pair</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Top Opportunities</h3>
                    <CandidateTable
                        candidates={MOCK_CANDIDATES}
                        onSimulate={(c) => setActiveCandidate(c)}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">My Network</h3>
                    {isRoutesLoading ? (
                        <p className="text-muted-foreground italic">Loading active routes...</p>
                    ) : (
                        <div className="bg-card border rounded-lg p-4">
                            {activeRoutes?.length > 0 ? (
                                <ul className="divide-y">
                                    {activeRoutes.map((r: any) => (
                                        <li key={r.id} className="py-2 flex justify-between">
                                            <span>{r.originAirportId} ⇌ {r.destinationAirportId}</span>
                                            <span className="text-muted-foreground italic text-sm">{r.strategicRole}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground italic text-sm">No routes opened yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <RouteSimulationDrawer
                isOpen={!!activeCandidate}
                candidate={activeCandidate}
                onClose={() => setActiveCandidate(null)}
            />
        </main>
    );
}
