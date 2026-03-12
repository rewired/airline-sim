import { useQuery } from "@tanstack/react-query";

interface DashboardOverview {
    airline: {
        id: string;
        name: string;
        cash: number;
    };
    profitToday: number;
    profitWeek: number;
    networkOtp: number;
    averageLoadFactor: number;
    activeAlerts: any[];
}

export function useDashboardOverview() {
    return useQuery<DashboardOverview>({
        queryKey: ["dashboard-overview"],
        queryFn: async () => {
            const res = await fetch("http://localhost:4000/api/dashboard");
            if (!res.ok) throw new Error("Failed to fetch dashboard");
            return res.json();
        },
        refetchInterval: 10000, // Refresh every 10s for the live effect
    });
}
