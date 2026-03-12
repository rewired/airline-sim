import { AircraftTail } from "@airline-sim/domain";
import { FlightLegDraft } from "../types";
import { Badge } from "@/components/ui/badge";

interface FlightTimelineProps {
    tails: AircraftTail[];
    legs: FlightLegDraft[];
}

export function FlightTimeline({ tails, legs }: FlightTimelineProps) {
    // A very simplified timeline visualization for the MVP slice
    const getLegsForTail = (tailId: string) => legs.filter(l => l.assignedTailId === tailId);

    const extractTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="border rounded-md bg-card overflow-hidden flex flex-col">
            <div className="bg-muted px-4 py-2 border-b grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
                <div className="col-span-2">Equipment Tail</div>
                <div className="col-span-10">00z - 24z Flight Schedule (Local Sandbox Day)</div>
            </div>

            <div className="divide-y relative">
                {tails.map(tail => (
                    <div key={tail.id} className="grid grid-cols-12 min-h-[80px] hover:bg-muted/5 transition-colors">

                        {/* Tail Column */}
                        <div className="col-span-2 p-4 border-r bg-muted/20 flex flex-col justify-center">
                            <span className="font-bold">{tail.registration}</span>
                            <span className="text-xs text-muted-foreground">{tail.typeId} • {tail.status}</span>
                        </div>

                        {/* Timeline Column */}
                        <div className="col-span-10 relative p-4 bg-grid-slate-100 dark:bg-grid-slate-900 flex items-center gap-2 overflow-x-auto">

                            {getLegsForTail(tail.id).map(leg => (
                                <div
                                    key={leg.id}
                                    className="bg-primary/10 border border-primary/20 rounded-md p-2 min-w-[180px] flex flex-col cursor-grab active:cursor-grabbing hover:border-primary transition-all"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-primary">{leg.flightNumber}</span>
                                        <Badge variant="outline" className="text-[10px] px-1 h-4">{leg.state}</Badge>
                                    </div>
                                    <div className="text-xs flex items-center gap-2 justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{leg.departureAirport.iata}</span>
                                            <span className="text-muted-foreground">{extractTime(leg.departureTimeUtc)}</span>
                                        </div>
                                        <span className="text-muted-foreground">→</span>
                                        <div className="flex flex-col text-right">
                                            <span className="font-semibold">{leg.arrivalAirport.iata}</span>
                                            <span className="text-muted-foreground">{extractTime(leg.arrivalTimeUtc)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {getLegsForTail(tail.id).length === 0 && (
                                <div className="text-muted-foreground text-sm italic py-4">
                                    No flights assigned. Tail is idle.
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Unassigned Pool */}
                <div className="grid grid-cols-12 min-h-[80px] bg-amber-500/5">
                    <div className="col-span-2 p-4 border-r border-amber-500/20 flex flex-col justify-center">
                        <span className="font-bold text-amber-500">Unassigned Pool</span>
                        <span className="text-xs text-muted-foreground">Drag to tail</span>
                    </div>
                    <div className="col-span-10 p-4 flex items-center gap-2 overflow-x-auto">
                        <div className="text-muted-foreground text-sm py-4 w-full flex justify-center border-2 border-dashed border-amber-500/30 rounded-lg items-center">
                            Drop new drafts here or leave unassigned
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
