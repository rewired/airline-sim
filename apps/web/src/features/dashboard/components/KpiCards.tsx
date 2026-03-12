import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KpiCardsProps {
    overview: {
        airline: { cash: number };
        profitToday: number;
        profitWeek: number;
        networkOtp: number;
        averageLoadFactor: number;
    }
}

export function KpiCards({ overview }: KpiCardsProps) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const formatPercent = (val: number) => `${(val * 100).toFixed(0)}% `;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
                    <span className="text-muted-foreground">🏦</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(overview.airline.cash)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Operating capital</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profit Today</CardTitle>
                    <span className="text-muted-foreground">📈</span>
                </CardHeader>
                <CardContent>
                    <div className={`text - 2xl font - bold ${overview.profitToday >= 0 ? "text-green-500" : "text-red-500"} `}>
                        {overview.profitToday >= 0 ? "+" : ""}{formatCurrency(overview.profitToday)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Week: {formatCurrency(overview.profitWeek)}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Network OTP</CardTitle>
                    <Badge variant={overview.networkOtp >= 90 ? "default" : "destructive"}>
                        {overview.networkOtp}%
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overview.networkOtp}%</div>
                    <p className="text-xs text-muted-foreground mt-1">On-Time Performance</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Load Factor</CardTitle>
                    <span className="text-muted-foreground">👥</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatPercent(overview.averageLoadFactor)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all planned legs</p>
                </CardContent>
            </Card>
        </div>
    )
}
