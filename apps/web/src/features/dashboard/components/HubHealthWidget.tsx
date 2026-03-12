import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function HubHealthWidget() {
    const hubs = [
        { name: "JFK", health: "Warning", activeFlights: 14, delayedFlights: 3, wx: "Storm" },
        { name: "LHR", health: "Healthy", activeFlights: 22, delayedFlights: 0, wx: "Clear" },
        { name: "FRA", health: "Healthy", activeFlights: 8, delayedFlights: 0, wx: "Clear" },
    ];

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Hub Diagnostics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hubs.map((hub) => (
                        <div key={hub.name} className={`p-4 rounded-xl border flex flex-col gap-2 ${hub.health === "Warning" ? "bg-amber-500/5 border-amber-500/20" : "bg-card"}`}>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-lg">{hub.name}</span>
                                <Badge variant={hub.health === "Healthy" ? "outline" : "secondary"} className={hub.health === "Warning" ? "bg-amber-500/20 text-amber-500" : ""}>
                                    {hub.health}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                <div>
                                    <div className="text-muted-foreground text-xs">Active</div>
                                    <div className="font-medium">{hub.activeFlights} Lg</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground text-xs">Delayed</div>
                                    <div className={`font-medium ${hub.delayedFlights > 0 ? "text-amber-500" : ""}`}>{hub.delayedFlights} Lg</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-muted-foreground text-xs">Weather</div>
                                    <div className="font-medium">{hub.wx}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
