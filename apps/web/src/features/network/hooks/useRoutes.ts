import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRoutes(airlineId: string = "123") {
    return useQuery({
        queryKey: ["routes", airlineId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:4000/api/routes?airlineId=${airlineId}`);
            if (!res.ok) throw new Error("Failed to fetch routes");
            return res.json();
        }
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
        }
    });
}
