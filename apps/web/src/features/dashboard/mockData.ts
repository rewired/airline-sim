export const mockDashboardOverview = {
    airline: { id: "1", name: "AeroOps Air", cash: 12500000 },
    profitToday: 45200,
    profitWeek: 315400,
    networkOtp: 92,
    averageLoadFactor: 0.86,
    activeAlerts: [
        { id: "a1", type: "weather", severity: "high" as const, summary: "Heavy snow at JFK. De-icing delays expected.", time: "10:14z" },
        { id: "a2", type: "technical", severity: "critical" as const, summary: "A320 Tail D-AIAX AOG at LHR. Engine #2 start fault.", time: "09:42z" },
        { id: "a3", type: "late_inbound", severity: "medium" as const, summary: "Flight AO104 to FRA delayed by 45m due to late inbound.", time: "08:15z" }
    ],
    criticalTails: []
};
