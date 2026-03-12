"use client";

import { KpiCards } from "@/features/dashboard/components/KpiCards";
import { AlertList } from "@/features/dashboard/components/AlertList";
import { TopBottomRoutes } from "@/features/dashboard/components/TopBottomRoutes";
import { HubHealthWidget } from "@/features/dashboard/components/HubHealthWidget";
import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";
import {
  useHubHealth,
  useRoutePerformance,
} from "@/features/dashboard/hooks/useDashboardInsights";

export default function Home() {
  const { data: overview, isLoading, error } = useDashboardOverview();
  const { data: routePerformance } = useRoutePerformance();
  const { data: hubHealth } = useHubHealth();

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;
  if (error || !overview)
    return <div className="p-8 text-red-500">Error loading dashboard</div>;

  return (
    <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome back. Here is the operational status of{" "}
          {overview.airline.name}.
        </p>
      </div>

      <KpiCards overview={overview} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4 col-span-1 lg:col-span-2">
          <HubHealthWidget hubs={hubHealth ?? []} />
          <TopBottomRoutes
            topRoutes={routePerformance?.topRoutes ?? []}
            bottomRoutes={routePerformance?.bottomRoutes ?? []}
          />
        </div>
        <div className="col-span-1">
          <AlertList alerts={overview.activeAlerts} />
        </div>
      </div>
    </main>
  );
}
