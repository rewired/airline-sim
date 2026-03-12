import { prisma } from "../prisma";

export const ScheduleVersionRepository = {
  async getLatestVersion(airlineId: string) {
    return prisma.scheduleVersion.findFirst({
      where: { airlineId },
      orderBy: { versionNumber: "desc" },
    });
  },

  async getPublishedVersion(airlineId: string) {
    return prisma.scheduleVersion.findFirst({
      where: { airlineId, status: "Published" },
      orderBy: { publishedAt: "desc" },
    });
  },

  async createDraftVersion(airlineId: string) {
    const latest = await this.getLatestVersion(airlineId);
    const nextVersionNumber = (latest?.versionNumber || 0) + 1;

    return prisma.scheduleVersion.create({
      data: {
        airlineId,
        versionNumber: nextVersionNumber,
        status: "Draft",
      },
    });
  },

  async archivePublishedVersions(airlineId: string) {
    return prisma.scheduleVersion.updateMany({
      where: { airlineId, status: "Published" },
      data: {
        status: "Archived",
        archivedAt: new Date(),
      },
    });
  },

  async publishVersion(scheduleVersionId: string) {
    return prisma.scheduleVersion.update({
      where: { id: scheduleVersionId },
      data: {
        status: "Published",
        publishedAt: new Date(),
      },
    });
  },
};
