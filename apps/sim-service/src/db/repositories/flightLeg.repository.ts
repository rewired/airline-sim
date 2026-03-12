import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

export const FlightLegRepository = {
    async getActiveFlights() {
        const legs = await prisma.flightLeg.findMany({
            where: {
                state: { in: ["scheduled", "boarding", "in_flight", "delayed", "diverted", "cancelled"] }
            }
        });

        return legs.map(leg => ({
            ...leg,
            status: leg.state, // Map state to status for frontend
            tailRegistration: leg.tailId || "N/A",
            departureAirport: { iata: leg.originAirportId },
            arrivalAirport: { iata: leg.destinationAirportId }
        }));
    },

    async getFlightsByTail(tailId: string) {
        return prisma.flightLeg.findMany({
            where: { tailId },
            orderBy: { scheduledDepartureUtc: 'asc' }
        });
    },

    async getFlightById(id: string) {
        return prisma.flightLeg.findUnique({ where: { id } });
    },

    async updateFlightTail(id: string, tailId: string | null) {
        return prisma.flightLeg.update({
            where: { id },
            data: { tailId }
        });
    },

    async updateFlightState(id: string, newState: string, profit?: number) {
        const data: Prisma.FlightLegUpdateInput = { state: newState };
        if (typeof profit === "number") {
            data.profit = profit;
        }

        return prisma.flightLeg.update({
            where: { id },
            data
        });
    },

    async cleanupArrivedFlights(olderThanHours: number = 24) {
        const cutOff = new Date();
        cutOff.setUTCHours(cutOff.getUTCHours() - olderThanHours);

        return prisma.flightLeg.deleteMany({
            where: {
                state: "arrived",
                scheduledArrivalUtc: { lt: cutOff }
            }
        });
    }
};
