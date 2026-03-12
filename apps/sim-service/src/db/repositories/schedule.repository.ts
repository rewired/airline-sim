import { prisma } from "../prisma";
import { FlightLegPlan } from "@airline-sim/domain";

export const ScheduleRepository = {
  async publishDraft(airlineId: string, legs: FlightLegPlan[]) {
    const nextMonday = this.getNextMonday();
    const routeIds = [...new Set(legs.map((leg) => leg.routeId))];
    const routes = await prisma.route.findMany({
      where: {
        airlineId,
        id: { in: routeIds },
      },
    });
    const routeById = new Map<
      string,
      { originAirportId: string; destinationAirportId: string }
    >(routes.map((route: any) => [route.id, route]));

    const flightLegsData = legs.map((leg) => {
      const route = routeById.get(leg.routeId);
      if (!route) {
        throw new Error(
          `Route ${leg.routeId} not found for airline ${airlineId}`,
        );
      }

      const departure = this.combineDateAndTime(
        nextMonday,
        leg.dayOfWeek,
        leg.departureTimeLocal,
      );
      const arrival = this.combineDateAndTime(
        nextMonday,
        leg.dayOfWeek,
        leg.arrivalTimeLocal,
      );

      return {
        flightNumber: "AS" + Math.floor(100 + Math.random() * 900),
        tailId: leg.plannedTailId,
        originAirportId: route.originAirportId,
        destinationAirportId: route.destinationAirportId,
        scheduledDepartureUtc: departure,
        scheduledArrivalUtc: arrival,
        state: "scheduled",
      };
    });

    return await prisma.flightLeg.createMany({
      data: flightLegsData,
    });
  },

  getNextMonday() {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    const day = d.getUTCDay();
    const diff = day === 0 ? 1 : 8 - day; // Next monday
    d.setUTCDate(d.getUTCDate() + diff);
    return d;
  },

  combineDateAndTime(baseDate: Date, dayOfWeek: number, timeStr: string) {
    const d = new Date(baseDate);
    d.setUTCDate(d.getUTCDate() + (dayOfWeek - 1)); // 1 = Monday
    const [hours, mins] = timeStr.split(":").map(Number);
    d.setUTCHours(hours, mins, 0, 0);
    return d;
  },
};
