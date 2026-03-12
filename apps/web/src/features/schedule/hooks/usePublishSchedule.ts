import { useMutation } from "@tanstack/react-query";
import { FlightLegPlan } from "@airline-sim/domain";

export function usePublishSchedule() {
    return useMutation({
        mutationFn: async (payload: { airlineId: string; legs: FlightLegPlan[] }) => {
            const res = await fetch("http://localhost:4000/api/schedule/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to publish schedule");
            }
            return res.json();
        }
    });
}
