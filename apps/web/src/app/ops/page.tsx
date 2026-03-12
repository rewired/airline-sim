"use client"

import { useState } from "react";
import { ActiveFlightsTable } from "@/features/ops/components/ActiveFlightsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActiveFlights, useLiveFlightUpdates } from "@/features/ops/hooks/useLiveFlights";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OpsCockpitPage() {
    useLiveFlightUpdates();
    const { data: flights, isLoading, error, refetch } = useActiveFlights();
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:4000");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "FLIGHT_STATUS_UPDATE") {
                refetch();
                if (data.payload.newState === "delayed") {
                    toast.error(`Flight Alert!`, {
                        description: `Flight ${data.payload.flightId} is now DELAYED.`,
                    });
                } else if (data.payload.newState === "cancelled") {
                    toast.error(`Cancellation!`, {
                        description: `Flight ${data.payload.flightId} has been CANCELLED.`,
                    });
                }
            }
        };
        return () => ws.close();
    }, [refetch]);

    if (isLoading) return (
        <div className="p-8 h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse">Synchronizing with Sim Service...</p>
        </div>
    );

    if (error) return (
        <div className="p-8 h-screen flex items-center justify-center">
            <Card className="max-w-md border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Connection Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Failed to load flight data. Please ensure the backend `sim-service` is running and accessible.</p>
                </CardContent>
            </Card>
        </div>
    );

    const delayedFlights = flights?.filter((f: any) => f.state === "delayed") || [];
    const filteredFlights = flights?.filter((f: any) => filter === "all" || f.state === filter) || [];

    return (
        <main className="flex flex-col h-full bg-muted/20 overflow-hidden">
            <header className="bg-background border-b px-8 py-4 shrink-0 flex justify-between items-center z-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ops Cockpit</h2>
                    <p className="text-muted-foreground">Monitor live operations, manage disruptions, and execute recovery plans.</p>
                </div>
                <div className="flex gap-6 items-center">
                    <Tabs value={filter} onValueChange={setFilter}>
                        <TabsList className="grid w-[400px] grid-cols-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="in_flight">In Flight</TabsTrigger>
                            <TabsTrigger value="boarding">Boarding</TabsTrigger>
                            <TabsTrigger value="delayed">Delayed</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex gap-4 border-l pl-6">
                        <div className="text-sm text-right">
                            <div className="text-muted-foreground">System Status</div>
                            <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-500 border-green-500/20">OPERATIONAL</Badge>
                        </div>
                        <div className="text-sm text-right">
                            <div className="text-muted-foreground">Active Delays</div>
                            <Badge variant={delayedFlights.length > 0 ? "destructive" : "secondary"} className="mt-1">
                                {delayedFlights.length}
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-8 max-w-[1800px] w-full mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-background to-muted/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Network OTP (D15)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">92.4%</div>
                            <p className="text-xs text-green-500 mt-1">↑ 1.2% from yesterday</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-background to-muted/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">AOG (Aircraft on Ground)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${delayedFlights.length > 0 ? "text-amber-500" : ""}`}>
                                {delayedFlights.length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Requiring immediate attention</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-background to-muted/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Weather Warnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground mt-1">No significant impact expected</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            Live Flight Monitor
                            <Badge variant="secondary" className="font-mono">
                                {filteredFlights.length} {filter !== "all" ? filter.replace("_", " ") : "total"}
                            </Badge>
                        </h3>
                    </div>
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <ActiveFlightsTable flights={filteredFlights} />
                    </div>
                </div>
            </div>
        </main>
    );
}
