import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useTailSwap() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ flightId1, flightId2 }: { flightId1: string, flightId2: string }) => {
            const res = await fetch("http://localhost:4000/api/ops/swap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flightId1, flightId2 }),
            });
            if (!res.ok) throw new Error("Swap failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["active-flights"] });
        },
    });
}
