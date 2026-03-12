import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Alert {
    id: string;
    type: string;
    severity: "critical" | "high" | "medium" | "low";
    summary: string;
    time: string;
}

export function AlertList({ alerts }: { alerts: Alert[] }) {
    const getBadgeVariant = (severity: string): "destructive" | "secondary" | "outline" | "default" => {
        switch (severity) {
            case "critical": return "destructive";
            case "high": return "destructive";
            case "medium": return "secondary";
            default: return "outline";
        }
    }

    return (
        <Card className="col-span-1 border-destructive/20 bg-destructive/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>Active Operations Alerts</span>
                    <Badge variant="destructive">{alerts.length}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    {alerts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No active alerts. Network is stable.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {alerts.map(alert => (
                                <button key={alert.id} className="text-left w-full p-3 rounded-lg border bg-card hover:bg-accent transition-colors flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <Badge variant={getBadgeVariant(alert.severity)}>
                                            {alert.type.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                                    </div>
                                    <p className="text-sm font-medium mt-1">{alert.summary}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
