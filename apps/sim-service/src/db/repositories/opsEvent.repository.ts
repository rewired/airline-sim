import { prisma } from "../prisma";

export const OpsEventRepository = {
  async createEvent(data: {
    scheduleVersionId: string;
    type: string;
    severity: string;
    affectedFlightId?: string;
    affectedTailId?: string;
    affectedAirportId?: string;
    impactPayload?: Record<string, unknown>;
  }) {
    return prisma.opsEvent.create({
      data: {
        scheduleVersionId: data.scheduleVersionId,
        type: data.type,
        severity: data.severity,
        affectedFlightId: data.affectedFlightId,
        affectedTailId: data.affectedTailId,
        affectedAirportId: data.affectedAirportId,
        impactPayload: data.impactPayload
          ? JSON.stringify(data.impactPayload)
          : undefined,
      },
    });
  },
};
