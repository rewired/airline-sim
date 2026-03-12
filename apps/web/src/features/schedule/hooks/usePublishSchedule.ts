import { useMutation } from "@tanstack/react-query";
import { FlightLegPlan } from "@airline-sim/domain";
import { SchedulePublishResponse } from "../types";

export function usePublishSchedule() {
  return useMutation({
    mutationFn: async (payload: { airlineId: string; legs: FlightLegPlan[] }) => {
      const res = await fetch("http://localhost:4000/api/schedule/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as SchedulePublishResponse;
      if (!res.ok) {
        throw data;
      }
      return data;
    },
  });
}
