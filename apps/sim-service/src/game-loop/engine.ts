import { FlightLegRepository } from "../db/repositories/flightLeg.repository";
import { FleetRepository } from "../db/repositories/fleet.repository";
import { calculateFlightEconomics } from "@airline-sim/analytics";

export class GameEngine {
    private tickInterval: NodeJS.Timeout | null = null;
    private tickRateMs = 5000; // 5 seconds per tick for MVP

    public start() {
        if (this.tickInterval) return;

        console.log(`[GameEngine] Starting tick loop: ${this.tickRateMs}ms`);
        this.tickInterval = setInterval(() => this.tick(), this.tickRateMs);
    }

    public stop() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
            console.log("[GameEngine] Stopped tick loop.");
        }
    }

    public onFlightStateChanged?: (flightId: string, newState: string) => void;

    private async tick() {
        try {
            const airlineId = "123"; // MVP
            const fleet = await FleetRepository.getFleet(airlineId);
            const now = new Date();

            // T085: Maintenance Completion
            for (const ac of fleet) {
                if (ac.status === "maintenance" && ac.maintenanceUntil && now >= ac.maintenanceUntil) {
                    await FleetRepository.completeMaintenance(ac.id);
                    console.log(`[Maintenance] Aircraft ${ac.registration} is back in service.`);
                    this.onFlightStateChanged?.(ac.id, "active");
                }
            }

            const activeFlights = await FlightLegRepository.getActiveFlights();
            for (const flight of activeFlights) {
                // T084: Basis-Disruptions-Generator
                if (flight.state === "scheduled" && Math.random() < 0.05) {
                    const reasons = ["Technical Issue", "Weather Delay", "Crew Shortage", "Late Inbound"];
                    const reason = reasons[Math.floor(Math.random() * reasons.length)];
                    await FlightLegRepository.updateFlightState(flight.id, "delayed");
                    this.onFlightStateChanged?.(flight.id, "delayed");
                    console.log(`[Disruption] Flight ${flight.flightNumber} delayed: ${reason}`);
                    continue; // Skip further transitions this tick
                }

                // Flight state machine
                if (flight.state === "scheduled") {
                    const minsToDep = (flight.scheduledDepartureUtc.getTime() - now.getTime()) / 60000;
                    if (minsToDep <= 30 && minsToDep > 0) {
                        await FlightLegRepository.updateFlightState(flight.id, "boarding");
                        this.onFlightStateChanged?.(flight.id, "boarding");
                    } else if (minsToDep <= 0) {
                        await FlightLegRepository.updateFlightState(flight.id, "in_flight");
                        this.onFlightStateChanged?.(flight.id, "in_flight");
                    }
                } else if (flight.state === "boarding") {
                    if (now >= flight.scheduledDepartureUtc) {
                        await FlightLegRepository.updateFlightState(flight.id, "in_flight");
                        this.onFlightStateChanged?.(flight.id, "in_flight");
                    }
                } else if (flight.state === "in_flight" || flight.state === "delayed") {
                    if (now >= flight.scheduledArrivalUtc) {
                        // T088 Revenue Management Logic
                        const basePrice = 150 + (Math.random() * 50 - 25); // Slight fluctuation
                        const economics = calculateFlightEconomics({
                            baseTicketPrice: basePrice,
                            loadFactor: 0.65 + Math.random() * 0.3, // 65-95%
                            seatingCapacity: 180,
                            blockHours: (flight.scheduledArrivalUtc.getTime() - flight.scheduledDepartureUtc.getTime()) / 3600000,
                            fuelBurnPerHour: 2400,
                            fuelPrice: 0.8,
                            ancillaryPerPax: 30
                        });

                        await FlightLegRepository.updateFlightState(flight.id, "arrived", economics.profit);
                        this.onFlightStateChanged?.(flight.id, "arrived");
                    }
                }
            }

            // Periodischer Cleanup (T077)
            await FlightLegRepository.cleanupArrivedFlights(1);
        } catch (error) {
            console.error("[GameEngine] Error during tick:", error);
        }
    }
}

// Singleton instance
export const gameEngine = new GameEngine();
