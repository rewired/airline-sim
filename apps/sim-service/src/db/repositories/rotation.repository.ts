import { prisma } from "../prisma";

export const RotationRepository = {
  async createRotation(scheduleVersionId: string, tailId: string, sequenceIndex: number) {
    return prisma.rotation.create({
      data: {
        scheduleVersionId,
        tailId,
        sequenceIndex,
      },
    });
  },

  async getByScheduleVersion(scheduleVersionId: string) {
    return prisma.rotation.findMany({
      where: { scheduleVersionId },
      orderBy: [{ tailId: "asc" }, { sequenceIndex: "asc" }],
    });
  },
};
