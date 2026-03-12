import { prisma } from "../prisma";

export const RouteRepository = {
    async getAllRoutes(airlineId: string) {
        return prisma.route.findMany({
            where: { airlineId }
        });
    },

    async createRoute(data: { airlineId: string, originAirportId: string, destinationAirportId: string, weeklyDemand: number, competitionScore: number, strategicRole: string }) {
        return prisma.route.create({ data });
    }
};
