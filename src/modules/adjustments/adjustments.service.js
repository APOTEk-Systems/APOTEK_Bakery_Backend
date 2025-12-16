import { PrismaClient } from "@prisma/client";
import { convertQuantityToBaseUnits, convertQuantityFromBaseUnits } from "../inventory/inventory.service.js";
const prisma = new PrismaClient();

export async function createInventoryAdjustment({
  inventoryItemId,
  amount,
  unit,
  reason,
  createdById,
}) {
  const existingInventoryItem = await prisma.inventoryItem.findUnique({
    where: { id: inventoryItemId },
  });

  if (!existingInventoryItem) {
    throw new Error("Inventory item not found.");
  }

  // Convert amount from the specified unit to base units for storage
  const convertedAmount = convertQuantityToBaseUnits(
    amount,
    unit,
    existingInventoryItem.type
  );

  if (convertedAmount < 0 && existingInventoryItem.currentQuantity + convertedAmount < 0) {
    throw new Error("Adjustment amount cannot make inventory quantity less than zero.");
  }

  const adjustment = await prisma.inventoryAdjustment.create({
    data: {
      inventoryItemId,
      amount,
      unit: unit, // Store the unit used for this adjustment
      reason,
      createdById,
    },
  });

  const inventoryItem = await prisma.inventoryItem.update({
    where: { id: inventoryItemId },
    data: {
      currentQuantity: {
        increment: convertedAmount,
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

  // Convert amounts from base units to display units for frontend
  const convertedAdjustments = adjustments.map(adjustment => ({
    ...adjustment,
    amount: convertQuantityFromBaseUnits(
      adjustment.amount,
      adjustment.inventoryItem.unit,
      adjustment.inventoryItem.type
    ),
  }));

  return { adjustments: convertedAdjustments, total, page, limit };
}
