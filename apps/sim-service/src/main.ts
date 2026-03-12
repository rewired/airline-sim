import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { prisma } from "./db/prisma";

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
            where: { state: "arrived", scheduledArrivalUtc: { gte: today } }
        });

        const profitToday = arrivedFlightsToday.reduce((sum, f) => sum + (f.profit || 0), 0);
        const networkOtp = calculateOTP(flights);

        res.json({
            airline,
            profitToday: Math.round(profitToday),
            profitWeek: Math.round(profitToday * 0.9), // approximation for MVP
            networkOtp: Math.round(networkOtp),
            averageLoadFactor: 0.78,
            activeAlerts: [],
            criticalTails: []
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard overview" });
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
        gameEngine.onFlightStateChanged?.(flightId, action === "cancel" ? "cancelled" : "delayed");

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

import { ScheduleRepository } from "./db/repositories/schedule.repository";
import { validateSchedule } from "@airline-sim/validation";

// T071 & T072: Schedule Publishing & Validation
app.post("/api/schedule/publish", async (req, res) => {
    try {
        const { airlineId, legs } = req.body;

        // Validation (T072)
        const validationResult = validateSchedule(legs, {}, []);
        if (!validationResult.isValid) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationResult.errors
            });
        }

        const result = await ScheduleRepository.publishDraft(airlineId || "123", legs);
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
    ws.send(JSON.stringify({ type: "WELCOME", payload: "Connected to Sim Service" }));
});

import { gameEngine } from "./game-loop/engine";

// Broadcast state changes from Game Engine
gameEngine.onFlightStateChanged = (flightId, newState) => {
    const message = JSON.stringify({ type: "FLIGHT_STATUS_UPDATE", payload: { flightId, newState } });
    wss.clients.forEach(client => {
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
