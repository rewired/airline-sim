import { prisma } from "../prisma";

interface OpenRouteCommand {
  commandId: string;
  airlineId: string;
  originAirportId: string;
  destinationAirportId: string;
  weeklyDemand: number;
  competitionScore: number;
  strategicRole: "feeder" | "trunk" | "thin" | "longhaul";
  plannedAircraftTypeId: string;
  weeklyFrequency: number;
  expectedContribution: number;
}

export const RouteRepository = {
  async getAllRoutes(airlineId: string) {
    return prisma.route.findMany({
      where: { airlineId },
    });
  },

  async createRoute(data: {
    airlineId: string;
    originAirportId: string;
    destinationAirportId: string;
    weeklyDemand: number;
    competitionScore: number;
    strategicRole: string;
  }) {
    return prisma.route.create({ data });
  },

  async applyOpenRouteCommand(command: OpenRouteCommand) {
    const route = await prisma.route.create({
      data: {
        airlineId: command.airlineId,
        originAirportId: command.originAirportId,
        destinationAirportId: command.destinationAirportId,
        weeklyDemand: command.weeklyDemand,
        competitionScore: command.competitionScore,
        strategicRole: command.strategicRole,
      },
    });

    return {
      accepted: true,
      commandId: command.commandId,
      route,
      simulation: {
        plannedAircraftTypeId: command.plannedAircraftTypeId,
        weeklyFrequency: command.weeklyFrequency,
        expectedContribution: command.expectedContribution,
      },
    };
  },
};
