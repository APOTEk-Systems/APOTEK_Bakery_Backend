import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createInventoryAdjustment({
  inventoryItemId,
  amount,
  reason,
  createdById,
}) {
  const existingInventoryItem = await prisma.inventoryItem.findUnique({
    where: { id: inventoryItemId },
  });

  if (!existingInventoryItem) {
    throw new Error("Inventory item not found.");
  }

  if (amount < 0 && existingInventoryItem.currentQuantity + amount < 0) {
    throw new Error("Adjustment amount cannot make inventory quantity less than zero.");
  }

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

export async function listInventoryAdjustments({
  startDate,
  endDate,
  type,
  name,
  page = 1,
  limit = 10,
  search,
}) {
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

  if (search) {
    where.OR = [
      {
        inventoryItem: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        reason: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [adjustments, total] = await prisma.$transaction([
    prisma.inventoryAdjustment.findMany({
      where,
      include: {
        inventoryItem: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.inventoryAdjustment.count({ where }),
  ]);

  return { adjustments, total, page, limit };
}
