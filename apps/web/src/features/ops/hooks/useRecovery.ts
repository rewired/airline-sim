import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRecovery() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ flightId, action }: { flightId: string, action: "cancel" | "delay" }) => {
            const res = await fetch("http://localhost:4000/api/ops/recover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ flightId, action }),
            });
            if (!res.ok) throw new Error("Recovery action failed");
            return res.json();
        },
        onSuccess: () => {
            // Let the WebSocket handle the update usually, but query invalidation is safer
            queryClient.invalidateQueries({ queryKey: ["activeFlights"] });
        }
    });
}
