import { prisma } from "../prisma";

export const RecoveryActionRepository = {
  async createAction(data: {
    opsEventId: string;
    actionType: string;
    tailId?: string;
    actor?: string;
    notes?: string;
    estimatedCost?: number;
  }) {
    return prisma.recoveryAction.create({
      data: {
        opsEventId: data.opsEventId,
        actionType: data.actionType,
        tailId: data.tailId,
        actor: data.actor || "system",
        notes: data.notes,
        estimatedCost: data.estimatedCost,
      },
    });
  },
};
