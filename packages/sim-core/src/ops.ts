import { OpsEvent, FlightLegPlan, RecoveryOption } from "@airline-sim/domain";

export function propagateDelay(
    event: OpsEvent,
    subsequentLegs: FlightLegPlan[]
): FlightLegPlan[] {
    // Placeholder: in reality this uses Date arithmetic to shift times
    return subsequentLegs;
}

export function calculateRecoveryOutcome(
    event: OpsEvent,
    optionType: RecoveryOption["type"]
): Pick<RecoveryOption, "estimatedCost" | "estimatedOtpDelta" | "estimatedCustomerImpact"> {
    switch (optionType) {
        case "cancel_leg":
            return { estimatedCost: 15000, estimatedOtpDelta: -2, estimatedCustomerImpact: 80 };
        case "tail_swap":
            return { estimatedCost: 2000, estimatedOtpDelta: 5, estimatedCustomerImpact: 10 };
        case "absorb_delay":
            return { estimatedCost: 5000, estimatedOtpDelta: -10, estimatedCustomerImpact: 40 };
        case "retime_leg":
            return { estimatedCost: 1000, estimatedOtpDelta: -5, estimatedCustomerImpact: 20 };
        case "defer_maintenance":
            return { estimatedCost: 0, estimatedOtpDelta: 0, estimatedCustomerImpact: 0 };
        case "activate_reserve":
            return { estimatedCost: 8000, estimatedOtpDelta: 8, estimatedCustomerImpact: 5 };
        default:
            return { estimatedCost: 0, estimatedOtpDelta: 0, estimatedCustomerImpact: 0 };
    }
}
