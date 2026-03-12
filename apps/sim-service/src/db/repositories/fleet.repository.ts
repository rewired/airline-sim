import { prisma } from "../prisma";

export const FleetRepository = {
    async getFleet(airlineId: string) {
        return prisma.aircraftTail.findMany({
            where: { airlineId }
        });
    },

    async updateHealth(tailId: string, degradationAmount: number) {
        return prisma.aircraftTail.update({
            where: { id: tailId },
            data: { health: { decrement: degradationAmount } }
        });
    },

    async getTailById(id: string) {
        return prisma.aircraftTail.findUnique({ where: { id } });
    },

    async scheduleMaintenance(tailId: string, until: Date) {
        return prisma.aircraftTail.update({
            where: { id: tailId },
            data: {
                status: "maintenance",
                maintenanceUntil: until
            }
        });
    },

    async completeMaintenance(tailId: string) {
        return prisma.aircraftTail.update({
            where: { id: tailId },
            data: {
                status: "active",
                health: 100.0,
                maintenanceUntil: null
            }
        });
    }
};
