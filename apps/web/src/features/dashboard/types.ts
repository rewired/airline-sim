export interface DashboardOverview {
    airline: { id: string; name: string; cash: number };
    profitToday: number;
    profitWeek: number;
    networkOtp: number;
    averageLoadFactor: number;
    activeAlerts: any[];
    criticalTails: any[];
}
