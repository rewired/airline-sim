import { useQuery } from "@tanstack/react-query";

export interface RoutePerformanceRow {
  routeId: string;
  pair: string;
  profit: number;
  marginPct: number;
}

export interface HubHealthRow {
  airportId: string;
  name: string;
  health: "Healthy" | "Warning";
  activeFlights: number;
  delayedFlights: number;
  weather: string;
}

export function useRoutePerformance(airlineId: string = "123") {
  return useQuery<{
    topRoutes: RoutePerformanceRow[];
    bottomRoutes: RoutePerformanceRow[];
  }>({
    queryKey: ["dashboard-route-performance", airlineId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4000/api/dashboard/route-performance?airlineId=${airlineId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch route performance");
      return res.json();
    },
    refetchInterval: 10000,
  });
}

export function useHubHealth(airlineId: string = "123") {
  return useQuery<HubHealthRow[]>({
    queryKey: ["dashboard-hub-health", airlineId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4000/api/dashboard/hub-health?airlineId=${airlineId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch hub health");
      return res.json();
    },
    refetchInterval: 10000,
  });
}
