import { prisma } from "../prisma";

export const MaintenanceWindowRepository = {
  async createWindow(data: {
    tailId: string;
    startsAtUtc: Date;
    endsAtUtc: Date;
    reason: string;
    severity?: string;
  }) {
    return prisma.maintenanceWindow.create({
      data: {
        ...data,
        severity: data.severity || "planned",
      },
    });
  },

  async getActiveWindows(referenceTime: Date = new Date()) {
    return prisma.maintenanceWindow.findMany({
      where: {
        startsAtUtc: { lte: referenceTime },
        endsAtUtc: { gte: referenceTime },
      },
    });
  },
};
