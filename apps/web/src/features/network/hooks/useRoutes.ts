import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenRouteCommand } from "../types";

export function useRoutes(airlineId: string = "123") {
  return useQuery({
    queryKey: ["routes", airlineId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:4000/api/routes?airlineId=${airlineId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch routes");
      return res.json();
    },
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRoute: {
      airlineId: string;
      originAirportId: string;
      destinationAirportId: string;
      weeklyDemand: number;
      competitionScore: number;
      strategicRole: string;
    }) => {
      const res = await fetch("http://localhost:4000/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoute),
      });
      if (!res.ok) throw new Error("Failed to create route");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}

export function useSubmitRouteCommand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (command: OpenRouteCommand) => {
      const res = await fetch("http://localhost:4000/api/routes/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Failed to submit route command");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    },
  });
}
