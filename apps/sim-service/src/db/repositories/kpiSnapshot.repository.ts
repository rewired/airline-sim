import { prisma } from "../prisma";

export const KpiSnapshotRepository = {
  async createSnapshot(data: {
    airlineId: string;
    scheduleVersionId?: string;
    profitToday: number;
    networkOtp: number;
    delayedFlights: number;
    cancelledFlights: number;
    activeFlights: number;
    utilization: number;
    notes?: string;
  }) {
    return prisma.kpiSnapshot.create({
      data,
    });
  },
};
