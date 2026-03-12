"use client"

import { useFleet } from "@/features/fleet/hooks/useFleet"
import { useScheduleMaintenance } from "@/features/fleet/hooks/useScheduleMaintenance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function FleetPage() {
    const { data: fleet, isLoading } = useFleet();
    const maintenance = useScheduleMaintenance();

    if (isLoading) return <div className="p-8">Loading fleet...</div>;

    const handleScheduleMaintenance = (tailId: string) => {
        if (confirm("Schedule 4h maintenance for this aircraft? It will be unavailable for flights.")) {
            maintenance.mutate(tailId);
        }
    };

    return (
        <main className="p-8 space-y-8 max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Fleet Management</h2>
                    <p className="text-muted-foreground">Monitor aircraft health, status, and utilization.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Aircraft</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tail Number</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Health</TableHead>
                                <TableHead>Utilization (Target)</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fleet?.map((ac: any) => (
                                <TableRow key={ac.id}>
                                    <TableCell className="font-mono font-bold">{ac.registration}</TableCell>
                                    <TableCell>{ac.typeId}</TableCell>
                                    <TableCell>
                                        <Badge variant={ac.status === "active" ? "default" : "outline"}>
                                            {ac.status.toUpperCase()}
                                        </Badge>
                                        {ac.maintenanceUntil && (
                                            <p className="text-[10px] text-muted-foreground">Until {new Date(ac.maintenanceUntil).toLocaleTimeString()}</p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${ac.health > 80 ? "bg-green-500" : ac.health > 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                                    style={{ width: `${ac.health}%` }}
                                                />
                                            </div>
                                            <span className="text-sm">{ac.health}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ac.utilizationTarget}h / day</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleScheduleMaintenance(ac.id)}
                                            disabled={ac.status === "maintenance" || maintenance.isPending}
                                        >
                                            Schedule Maintenance
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}
