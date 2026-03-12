import { OpsFlightLeg } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecovery } from "../hooks/useRecovery";
import { useTailSwap } from "../hooks/useTailSwap";


interface ActiveFlightsTableProps {
    flights: OpsFlightLeg[];
}

export function ActiveFlightsTable({ flights }: ActiveFlightsTableProps) {
    const recovery = useRecovery();
    const swap = useTailSwap();

    const getStatusBadge = (status: OpsFlightLeg["status"]) => {
        switch (status) {
            case "in_flight": return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">In Flight</Badge>;
            case "arrived": return <Badge variant="secondary" className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Arrived</Badge>;
            case "delayed": return <Badge variant="destructive">Delayed</Badge>;
            case "boarding": return <Badge variant="secondary">Boarding</Badge>;
            case "diverted": return <Badge variant="destructive" className="bg-purple-500 hover:bg-purple-600">Diverted</Badge>;
            case "cancelled": return <Badge variant="destructive" className="bg-red-900 border-red-500">Cancelled</Badge>;
        }
    };

    const formatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleManage = async (flight: OpsFlightLeg) => {
        const choice = prompt("Manage Flight: [1] Cancel, [2] Delay, [3] Swap Aircraft");
        if (choice === "1") {
            const result = await recovery.mutateAsync({ flightId: flight.id, action: "cancel" });
            alert(`Impact: OTP ${result.impact.otpDeltaPct}% | Cost Δ ${result.impact.estimatedCostDelta}. ${result.impact.summary}`);
        } else if (choice === "2") {
            const result = await recovery.mutateAsync({ flightId: flight.id, action: "delay" });
            alert(`Impact: OTP ${result.impact.otpDeltaPct}% | Cost Δ ${result.impact.estimatedCostDelta}. ${result.impact.summary}`);
        } else if (choice === "3") {
            const targetFlightId = prompt("Enter Flight ID/Number to swap with (MVP: enter another active Flight ID):");
            if (targetFlightId) {
                const result = await swap.mutateAsync({ flightId1: flight.id, flightId2: targetFlightId });
                alert(`Impact: OTP ${result.impact.otpDeltaPct}% | Cost Δ ${result.impact.estimatedCostDelta}. ${result.impact.summary}`);
            }
        }
    };

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Flight</TableHead>
                        <TableHead>Tail</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>STD</TableHead>
                        <TableHead>ETD</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Delay Reason</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {flights.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                No active flights found for this filter.
                            </TableCell>
                        </TableRow>
                    ) : (
                        flights.map((flight) => (
                            <TableRow key={flight.id}>
                                <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                                <TableCell>{flight.tailRegistration}</TableCell>
                                <TableCell>{flight.departureAirport.iata} → {flight.arrivalAirport.iata}</TableCell>
                                <TableCell>{formatTime(flight.scheduledDepartureUtc)}</TableCell>
                                <TableCell className={flight.scheduledDepartureUtc !== flight.estimatedDepartureUtc ? "text-amber-500 font-medium" : ""}>
                                    {formatTime(flight.estimatedDepartureUtc)}
                                </TableCell>
                                <TableCell>{getStatusBadge(flight.status)}</TableCell>
                                <TableCell className="text-muted-foreground">{flight.delayReason || "-"}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleManage(flight)}
                                        disabled={recovery.isPending || swap.isPending || flight.status === "arrived" || flight.status === "cancelled"}
                                    >
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
