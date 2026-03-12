import { prisma } from "../prisma";

export const AirlineRepository = {
    async getBaseAirline(id: string) {
        let airline = await prisma.airline.findUnique({ where: { id } });

        // Seed generic airline if it doesn't exist for MVP
        if (!airline) {
            airline = await prisma.airline.create({
                data: { id, name: "AeroOps Air", cash: 12500000 }
            });
        }

        return airline;
    },

    async updateCash(id: string, amount: number) {
        return prisma.airline.update({
            where: { id },
            data: { cash: { increment: amount } }
        });
    }
};
