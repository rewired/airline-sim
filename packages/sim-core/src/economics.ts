import { Route, Airport, AircraftType, RouteEconomics } from "@airline-sim/domain";

export function calculateRouteEconomics(
    route: Route,
    origin: Airport,
    destination: Airport,
    aircraft: AircraftType,
    frequencyWeekly: number,
    ticketPrice: number
): RouteEconomics {
    // Mock calculation for vertical slice
    const distanceKm = 1000; // Simplified
    const baseDemand = (origin.demandScore + destination.demandScore) / 2;
    const capacity = aircraft.seats * frequencyWeekly * 2; // round trip
    const rawDemand = baseDemand * (1 - ticketPrice / 500); // basic elasticity

    const loadFactor = Math.min(1, Math.max(0.1, rawDemand / capacity));
    const pax = capacity * loadFactor;

    const revenue = pax * ticketPrice;
    const blockHours = (distanceKm / 800) * frequencyWeekly * 2;
    const directCost = blockHours * aircraft.costPerBlockHour;

    return {
        routeId: route.id,
        revenue,
        directCost,
        contribution: revenue - directCost,
        loadFactor,
        otpPenaltyCost: 0
    };
}
