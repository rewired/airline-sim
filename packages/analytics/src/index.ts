import { FlightLegPlan } from "@airline-sim/domain";

export function calculateOTP(flights: { state: string, scheduledDepartureUtc: Date, estimatedDepartureUtc?: Date | null }[]): number {
    if (flights.length === 0) return 0;

    // OTP (D0 or A14) - Here we use simple D0 (on-time departure)
    // A flight is on time if estimatedDeparture - scheduledDeparture <= 0 (or 15 mins for A14)
    const onTimeCount = flights.filter(f => {
        if (!f.estimatedDepartureUtc) return true;
        const sched = new Date(f.scheduledDepartureUtc).getTime();
        const est = new Date(f.estimatedDepartureUtc).getTime();
        const delay = (est - sched) / 60000;
        return delay <= 15; // A15 standard
    }).length;

    return (onTimeCount / flights.length) * 100;
}

export function calculateFlightEconomics(params: {
    baseTicketPrice: number,
    loadFactor: number,
    seatingCapacity: number,
    blockHours: number,
    fuelBurnPerHour: number,
    fuelPrice: number,
    ancillaryPerPax: number
}) {
    const paxCount = params.loadFactor * params.seatingCapacity;
    const revenue = paxCount * (params.baseTicketPrice + params.ancillaryPerPax);
    const fuelCost = params.blockHours * params.fuelBurnPerHour * params.fuelPrice;

    // simplified direct cost
    const totalCost = fuelCost + (params.blockHours * 500); // 500 fixed other costs per hour

    return {
        revenue,
        cost: totalCost,
        profit: revenue - totalCost,
        margin: (revenue - totalCost) / revenue
    };
}
