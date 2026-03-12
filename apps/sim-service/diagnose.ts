import { prisma } from "./src/db/prisma";
import { FlightLegRepository } from "./src/db/repositories/flightLeg.repository";

async function diagnose() {
    try {
        console.log("Checking Airline 123...");
        const airline = await prisma.airline.findUnique({ where: { id: "123" } });
        console.log("Airline:", airline);

        console.log("Checking Fleet...");
        const fleet = await prisma.aircraftTail.findMany({ where: { airlineId: "123" } });
        console.log("Fleet count:", fleet.length);

        console.log("Checking Active Flights...");
        const flights = await FlightLegRepository.getActiveFlights();
        console.log("Active flights count:", flights.length);

        console.log("Checking Dashboard Logic...");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const arrivedFlightsToday = await prisma.flightLeg.findMany({
            where: { state: "arrived", scheduledArrivalUtc: { gte: today } }
        });
        console.log("Arrived today:", arrivedFlightsToday.length);

        console.log("DIAGNOSTIC SUCCESSFUL");
    } catch (err: any) {
        console.error("DIAGNOSTIC FAILED:", err.message);
        if (err.code) console.error("Error Code:", err.code);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
