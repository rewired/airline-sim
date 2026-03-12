import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useActiveFlights() {
    return useQuery({
        queryKey: ["activeFlights"],
        queryFn: async () => {
            const res = await fetch("http://localhost:4000/api/ops/flights");
            if (!res.ok) throw new Error("Failed to fetch active flights");
            return res.json();
        }
    });
}

export function useLiveFlightUpdates() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:4000");

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "FLIGHT_STATUS_UPDATE") {
                    const { flightId, newState } = message.payload;

                    queryClient.setQueryData(["activeFlights"], (oldData: any[]) => {
                        if (!oldData) return oldData;
                        return oldData.map((f) =>
                            f.id === flightId ? { ...f, state: newState } : f
                        );
                    });
                }
            } catch (err) {
                console.error("WebSocket message error:", err);
            }
        };

        return () => ws.close();
    }, [queryClient]);
}
