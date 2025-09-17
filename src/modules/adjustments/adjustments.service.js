import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createInventoryAdjustment({
  inventoryItemId,
  amount,
  reason,
  createdById,
}) {
  const adjustment = await prisma.inventoryAdjustment.create({
    data: {
      inventoryItemId,
      amount,
      reason,
      createdById,
    },
  });

  const inventoryItem = await prisma.inventoryItem.update({
    where: { id: inventoryItemId },
    data: {
      currentQuantity: {
        increment: amount,
      },
    },
  });

  return { adjustment, inventoryItem };
}

export async function listInventoryAdjustments({ date, type }) {
  const where = {};

  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  if (type) {
    where.inventoryItem = {
      type: type,
    };
  }

  return await prisma.inventoryAdjustment.findMany({
    where,
    include: {
      inventoryItem: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
