import { FlightLegRepository } from "../db/repositories/flightLeg.repository";
import { FleetRepository } from "../db/repositories/fleet.repository";
import { calculateFlightEconomics } from "@airline-sim/analytics";
import { OpsEventRepository } from "../db/repositories/opsEvent.repository";
import { KpiSnapshotRepository } from "../db/repositories/kpiSnapshot.repository";
import { ScheduleVersionRepository } from "../db/repositories/scheduleVersion.repository";
import { prisma } from "../db/prisma";

export class GameEngine {
  private tickInterval: NodeJS.Timeout | null = null;
  private tickRateMs = 5000; // 5 seconds per tick for MVP
  private kpiSnapshotEveryTicks = 6; // 30 seconds
  private tickCounter = 0;

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
      const publishedScheduleVersion =
        await ScheduleVersionRepository.getPublishedVersion(airlineId);

      // T085: Maintenance Completion
      for (const ac of fleet) {
        if (
          ac.status === "maintenance" &&
          ac.maintenanceUntil &&
          now >= ac.maintenanceUntil
        ) {
          await FleetRepository.completeMaintenance(ac.id);
          console.log(
            `[Maintenance] Aircraft ${ac.registration} is back in service.`,
          );
          this.onFlightStateChanged?.(ac.id, "active");
        }
      }

      const activeFlights = await FlightLegRepository.getActiveFlights();
      for (const flight of activeFlights) {
        // T084: Basis-Disruptions-Generator
        if (flight.state === "scheduled" && Math.random() < 0.05) {
          const reasons = [
            "Technical Issue",
            "Weather Delay",
            "Crew Shortage",
            "Late Inbound",
          ];
          const reason = reasons[Math.floor(Math.random() * reasons.length)];
          await FlightLegRepository.updateFlightState(flight.id, "delayed");
          this.onFlightStateChanged?.(flight.id, "delayed");

          if (publishedScheduleVersion) {
            await OpsEventRepository.createEvent({
              scheduleVersionId: publishedScheduleVersion.id,
              type: "flight_disruption",
              severity: "medium",
              affectedFlightId: flight.id,
              affectedTailId: flight.tailId || undefined,
              affectedAirportId: flight.originAirportId,
              impactPayload: { reason },
            });
          }

          console.log(`[Disruption] Flight ${flight.flightNumber} delayed: ${reason}`);
          continue; // Skip further transitions this tick
        }

        // Flight state machine
        if (flight.state === "scheduled") {
          const minsToDep =
            (flight.scheduledDepartureUtc.getTime() - now.getTime()) / 60000;
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
            const basePrice = 150 + (Math.random() * 50 - 25);
            const economics = calculateFlightEconomics({
              baseTicketPrice: basePrice,
              loadFactor: 0.65 + Math.random() * 0.3,
              seatingCapacity: 180,
              blockHours:
                (flight.scheduledArrivalUtc.getTime() -
                  flight.scheduledDepartureUtc.getTime()) /
                3600000,
              fuelBurnPerHour: 2400,
              fuelPrice: 0.8,
              ancillaryPerPax: 30,
            });

            await FlightLegRepository.updateFlightState(
              flight.id,
              "arrived",
              economics.profit,
            );
            this.onFlightStateChanged?.(flight.id, "arrived");
          }
        }
      }

      this.tickCounter += 1;
      if (this.tickCounter % this.kpiSnapshotEveryTicks === 0) {
        await this.persistKpiSnapshot(airlineId, publishedScheduleVersion?.id);
      }

      // Periodischer Cleanup (T077)
      await FlightLegRepository.cleanupArrivedFlights(1);
    } catch (error) {
      console.error("[GameEngine] Error during tick:", error);
    }
  }

  private async persistKpiSnapshot(
    airlineId: string,
    scheduleVersionId?: string,
  ) {
    const flights = await FlightLegRepository.getActiveFlights();
    const delayedFlights = flights.filter((f) => f.state === "delayed").length;
    const cancelledFlights = flights.filter((f) => f.state === "cancelled").length;
    const inFlightCount = flights.filter((f) => f.state === "in_flight").length;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const arrivedToday = await prisma.flightLeg.findMany({
      where: {
        state: "arrived",
        scheduledArrivalUtc: { gte: today },
      },
    });

    const onTimeArrivals = arrivedToday.filter(
      (f) =>
        f.estimatedArrivalUtc &&
        f.estimatedArrivalUtc.getTime() <= f.scheduledArrivalUtc.getTime(),
    ).length;
    const networkOtp =
      arrivedToday.length > 0 ? (onTimeArrivals / arrivedToday.length) * 100 : 100;

    const utilization = flights.length > 0 ? (inFlightCount / flights.length) * 100 : 0;
    const profitToday = arrivedToday.reduce((sum, f) => sum + (f.profit || 0), 0);

    await KpiSnapshotRepository.createSnapshot({
      airlineId,
      scheduleVersionId,
      profitToday,
      networkOtp,
      delayedFlights,
      cancelledFlights,
      activeFlights: flights.length,
      utilization,
      notes: "Automated engine snapshot",
    });
  }
}

// Singleton instance
export const gameEngine = new GameEngine();
