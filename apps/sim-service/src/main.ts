import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { prisma } from "./db/prisma";
import { z } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

import { AirlineRepository } from "./db/repositories/airline.repository";
import { calculateOTP } from "@airline-sim/analytics";

// Real Dashboard Overview API (T081)
app.get("/api/dashboard", async (req, res) => {
  try {
    const airlineId = (req.query.airlineId as string) || "123";
    const airline = await AirlineRepository.getBaseAirline(airlineId);
    const flights = await FlightLegRepository.getActiveFlights();

    // T086: Sum profits from flights arrived today/week
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const arrivedFlightsToday = await prisma.flightLeg.findMany({
      where: { state: "arrived", scheduledArrivalUtc: { gte: today } },
    });

    const profitToday = arrivedFlightsToday.reduce(
      (sum, f) => sum + (f.profit || 0),
      0,
    );
    const networkOtp = calculateOTP(flights);

    res.json({
      airline,
      profitToday: Math.round(profitToday),
      profitWeek: Math.round(profitToday * 0.9), // approximation for MVP
      networkOtp: Math.round(networkOtp),
      averageLoadFactor: 0.78,
      activeAlerts: [],
      criticalTails: [],
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard overview" });
  }
});

app.get("/api/dashboard/route-performance", async (req, res) => {
  try {
    const airlineId = (req.query.airlineId as string) || "123";
    const routes = await RouteRepository.getAllRoutes(airlineId);
    const routeMetrics = await Promise.all(
      routes.map(async (route: any) => {
        const legs = await prisma.flightLeg.findMany({
          where: {
            originAirportId: route.originAirportId,
            destinationAirportId: route.destinationAirportId,
          },
        });

        const totalProfit = legs.reduce(
          (sum: number, leg: any) => sum + (leg.profit || 0),
          0,
        );
        const revenueProxy = Math.max(route.weeklyDemand * 120, 1);
        const marginPct = (totalProfit / revenueProxy) * 100;

        return {
          routeId: route.id,
          pair: `${route.originAirportId}-${route.destinationAirportId}`,
          profit: Math.round(totalProfit),
          marginPct,
        };
      }),
    );

    const topRoutes = [...routeMetrics]
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
    const bottomRoutes = [...routeMetrics]
      .sort((a, b) => a.profit - b.profit)
      .slice(0, 5);

    res.json({ topRoutes, bottomRoutes });
  } catch (err) {
    console.error("Route performance error:", err);
    res.status(500).json({ error: "Failed to fetch route performance" });
  }
});

app.get("/api/dashboard/hub-health", async (req, res) => {
  try {
    const airlineId = (req.query.airlineId as string) || "123";
    const routes = await RouteRepository.getAllRoutes(airlineId);
    const airportIds = [
      ...new Set(
        routes.flatMap((r: any) => [r.originAirportId, r.destinationAirportId]),
      ),
    ];
    const activeStates = [
      "scheduled",
      "boarding",
      "in_flight",
      "delayed",
      "diverted",
    ];
    const delayedStates = ["delayed", "diverted"];

    const healthRows = await Promise.all(
      airportIds.map(async (airportId) => {
        const [activeFlights, delayedFlights] = await Promise.all([
          prisma.flightLeg.count({
            where: {
              state: { in: activeStates },
              OR: [
                { originAirportId: airportId },
                { destinationAirportId: airportId },
              ],
            },
          }),
          prisma.flightLeg.count({
            where: {
              state: { in: delayedStates },
              OR: [
                { originAirportId: airportId },
                { destinationAirportId: airportId },
              ],
            },
          }),
        ]);

        return {
          airportId,
          name: airportId,
          health: delayedFlights > 0 ? "Warning" : "Healthy",
          activeFlights,
          delayedFlights,
          weather: delayedFlights > 0 ? "Disruption" : "Stable",
        };
      }),
    );

    res.json(healthRows);
  } catch (err) {
    console.error("Hub health error:", err);
    res.status(500).json({ error: "Failed to fetch hub health" });
  }
});

import { FlightLegRepository } from "./db/repositories/flightLeg.repository";

app.get("/api/ops/flights", async (req, res) => {
  try {
    const flights = await FlightLegRepository.getActiveFlights();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active flights" });
  }
});

app.post("/api/ops/recover", async (req, res) => {
  try {
    const { flightId, action } = req.body;

    if (action === "cancel") {
      await FlightLegRepository.updateFlightState(flightId, "cancelled");
    } else if (action === "delay") {
      // For MVP, just move estimated arrival 1 hour
      await FlightLegRepository.updateFlightState(flightId, "delayed");
    }

    // Broadcast the update immediately via WS (T066)
    gameEngine.onFlightStateChanged?.(
      flightId,
      action === "cancel" ? "cancelled" : "delayed",
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Recovery action failed" });
  }
});

app.post("/api/ops/swap", async (req, res) => {
  try {
    const { flightId1, flightId2 } = req.body;

    const f1 = await FlightLegRepository.getFlightById(flightId1);
    const f2 = await FlightLegRepository.getFlightById(flightId2);

    if (!f1 || !f2) return res.status(404).json({ error: "Flight not found" });

    // Swap tails
    await FlightLegRepository.updateFlightTail(flightId1, f2.tailId);
    await FlightLegRepository.updateFlightTail(flightId2, f1.tailId);

    // Broadcast updates
    gameEngine.onFlightStateChanged?.(flightId1, f1.state);
    gameEngine.onFlightStateChanged?.(flightId2, f2.state);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Swap failed" });
  }
});

import { RouteRepository } from "./db/repositories/route.repository";

// Route Management API (T069)
app.get("/api/routes", async (req, res) => {
  try {
    const airlineId = (req.query.airlineId as string) || "123";
    const routes = await RouteRepository.getAllRoutes(airlineId);
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

app.post("/api/routes", async (req, res) => {
  try {
    const route = await RouteRepository.createRoute(req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ error: "Failed to create route" });
  }
});

const OpenRouteCommandSchema = z.object({
  commandId: z.string().min(1),
  airlineId: z.string().min(1),
  originAirportId: z.string().min(1),
  destinationAirportId: z.string().min(1),
  weeklyDemand: z.number().positive(),
  competitionScore: z.number().min(0).max(1),
  strategicRole: z.enum(["feeder", "trunk", "thin", "longhaul"]),
  plannedAircraftTypeId: z.string().min(1),
  weeklyFrequency: z.number().int().positive(),
  expectedContribution: z.number(),
});

app.post("/api/routes/commands", async (req, res) => {
  try {
    const parseResult = OpenRouteCommandSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Invalid route command",
        details: parseResult.error.issues,
      });
    }

    const result = await RouteRepository.applyOpenRouteCommand(
      parseResult.data,
    );
    res.status(201).json(result);
  } catch (err) {
    console.error("Route command error:", err);
    res.status(500).json({ error: "Failed to apply route command" });
  }
});

import { ScheduleRepository } from "./db/repositories/schedule.repository";
import { validateSchedule } from "@airline-sim/validation";
import {
  FlightLegPlanSchema,
  AircraftType,
  MaintenanceWindow,
} from "@airline-sim/domain";

// T071 & T072: Schedule Publishing & Validation
app.post("/api/schedule/publish", async (req, res) => {
  try {
    const { airlineId, legs } = req.body;
    const effectiveAirlineId = airlineId || "123";

    const parseResult = FlightLegPlanSchema.array().safeParse(legs);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Invalid schedule payload",
        details: parseResult.error.issues,
      });
    }

    const typedLegs = parseResult.data;

    const fleet = await FleetRepository.getFleet(effectiveAirlineId);
    const now = new Date();
    const maintenanceWindows: MaintenanceWindow[] = fleet
      .filter((tail) => tail.status === "maintenance" && tail.maintenanceUntil)
      .map((tail) => ({
        id: `mw-${tail.id}`,
        tailId: tail.id,
        startAt: now.toISOString(),
        endAt: tail.maintenanceUntil!.toISOString(),
        severity: "planned",
      }));

    const aircraftSpecs: Record<string, AircraftType> = {};

    // Validation (T072)
    const validationResult = validateSchedule(
      typedLegs,
      aircraftSpecs,
      maintenanceWindows,
    );
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.errors,
      });
    }

    const result = await ScheduleRepository.publishDraft(
      effectiveAirlineId,
      typedLegs,
    );
    res.json({ success: true, count: result.count });
  } catch (err) {
    console.error("Publish error:", err);
    res.status(500).json({ error: "Failed to publish schedule" });
  }
});

import { FleetRepository } from "./db/repositories/fleet.repository";

// T083 Fleet API
app.get("/api/fleet", async (req, res) => {
  try {
    const airlineId = (req.query.airlineId as string) || "123";
    const fleet = await FleetRepository.getFleet(airlineId);
    res.json(fleet);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fleet" });
  }
});

app.post("/api/fleet/maintenance", async (req, res) => {
  try {
    const { tailId } = req.body;
    // Maintenance takes 4 hours for MVP
    const until = new Date(Date.now() + 4 * 60 * 60 * 1000);
    await FleetRepository.scheduleMaintenance(tailId, until);
    res.json({ success: true, maintenanceUntil: until });
  } catch (err) {
    res.status(500).json({ error: "Failed to schedule maintenance" });
  }
});

// Websocket for live alerts (T054 & T066)
wss.on("connection", (ws) => {
  console.log("Client connected via WebSocket");
  ws.send(
    JSON.stringify({ type: "WELCOME", payload: "Connected to Sim Service" }),
  );
});

import { gameEngine } from "./game-loop/engine";

// Broadcast state changes from Game Engine
gameEngine.onFlightStateChanged = (flightId, newState) => {
  const message = JSON.stringify({
    type: "FLIGHT_STATUS_UPDATE",
    payload: { flightId, newState },
  });
  wss.clients.forEach((client) => {
    if (client.readyState === 1 /* ws.OPEN */) {
      client.send(message);
    }
  });
};

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Sim Service running on http://localhost:${PORT}`);
  gameEngine.start();
});
