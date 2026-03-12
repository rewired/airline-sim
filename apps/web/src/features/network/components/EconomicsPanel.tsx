import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EconomicsPanelProps {
    revenue: number;
    cost: number;
    contribution: number;
    loadFactor: number;
}

export function EconomicsPanel({ revenue, cost, contribution, loadFactor }: EconomicsPanelProps) {
    const formatCur = (val: number) => `$${val.toLocaleString()}`;
    const isProfitable = contribution >= 0;

    return (
        <Card className="bg-muted/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm">Weekly Economics Projection</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Est. Revenue</span>
                        <span className="font-medium text-foreground">{formatCur(revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Direct Ops Cost</span>
                        <span className="font-medium text-destructive">-{formatCur(cost)}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Net Contribution</span>
                        <span className={isProfitable ? "text-green-500" : "text-destructive"}>
                            {isProfitable ? "+" : ""}{formatCur(contribution)}
                        </span>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="text-muted-foreground">Break-even Load Factor</span>
                            <span>{(loadFactor * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 flex rounded-full overflow-hidden">
                            <div className={loadFactor >= 0.75 ? "bg-green-500" : "bg-amber-500"} style={{ width: `${loadFactor * 100}%` }} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
