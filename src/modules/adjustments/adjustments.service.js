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

export async function listInventoryAdjustments({ startDate, endDate, type, name }) {
  const where = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  if (type) {
    where.inventoryItem = {
      type: type,
    };
  }

  if (name) {
    where.inventoryItem = {
      ...where.inventoryItem,
      name: {
        contains: name,
        mode: "insensitive",
      },
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
