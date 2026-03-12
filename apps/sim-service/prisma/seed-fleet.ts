import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const airlineId = "123";

    // 1. Ensure Airline exists
    await prisma.airline.upsert({
        where: { id: airlineId },
        update: {},
        create: {
            id: airlineId,
            name: "AeroOps Air",
            cash: 12500000
        }
    });

    // 2. Clear old fleet for clean start
    await prisma.aircraftTail.deleteMany({ where: { airlineId } });

    // 3. Create Aircraft
    const types = ["A320", "B738", "A321"];
    const registrations = ["D-AIBA", "D-AIBB", "D-AIBC", "D-AIBD"];

    for (let i = 0; i < registrations.length; i++) {
        await prisma.aircraftTail.create({
            data: {
                id: `tail-${i}`,
                airlineId,
                typeId: types[i % types.length],
                registration: registrations[i],
                status: "active",
                health: 100.0,
                utilizationTarget: 12.0
            }
        });
    }

    console.log("Seeding completed: Airline '123' with 4 aircraft created.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
