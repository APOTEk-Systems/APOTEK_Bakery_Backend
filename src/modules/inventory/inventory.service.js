
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @namespace InventoryService
 * @description Handles all inventory-related business logic.
 */

/**
 * Retrieves all inventory items from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of inventory items.
 * @memberof InventoryService
 */
export const getAllInventoryItems = async (type) => {
  const where = {};
  if (type) {
    where.type = type;
  }
 const items = await prisma.inventoryItem.findMany({ where });                                                 
 return items.sort((a, b) => a.name.localeCompare(b.name)); 
};

/**
 * Creates a new inventory item.
 * @param {object} inventoryItemData - The data for the new inventory item.
 * @param {number} userId - The ID of the user creating the inventory item.
 * @returns {Promise<object>} A promise that resolves to the newly created inventory item.
 * @memberof InventoryService
 */
export const createInventoryItem = async (inventoryItemData, userId) => {
  const data = {
    ...inventoryItemData,
    createdBy: { connect: { id: userId } },
    updatedBy: { connect: { id: userId } },
  };
  return await prisma.inventoryItem.create({ data });
};

/**
 * Retrieves a single inventory item by its ID.
 * @param {number} id - The ID of the inventory item to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the inventory item or null if not found.
 * @memberof InventoryService
 */
export const getInventoryItemById = async (id) => {
  return await prisma.inventoryItem.findUnique({
    where: { id },
  });
};

/**
 * Updates an existing inventory item in the database.
 * @param {number} id - The ID of the inventory item to update.
 * @param {object} inventoryItemData - The data to update the inventory item with.
 * @param {number} userId - The ID of the user updating the inventory item.
 * @returns {Promise<object>} A promise that resolves to the updated inventory item.
 * @memberof InventoryService
 */
export const updateInventoryItem = async (id, inventoryItemData, userId) => {
  const data = {
    ...inventoryItemData,
    updatedBy: { connect: { id: userId } },
  };
  return await prisma.inventoryItem.update({
    where: { id },
    data,
  });
};

/**
 * Deletes an inventory item from the database.
 * @param {number} id - The ID of the inventory item to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted inventory item.
 * @memberof InventoryService
 */
export const deleteInventoryItem = async (id) => {
  return await prisma.inventoryItem.delete({
    where: { id },
  });
};

/**
 * Deducts inventory for a production run and calculates the cost.
 * @param {Array<{inventoryItemId: number, amountDeducted: number}>} ingredients - An array of ingredients to deduct.
 * @returns {Promise<Array<{inventoryItemId: number, amountDeducted: number, cost: number}>>} A promise that resolves to an array of deduction details including cost.
 * @memberof InventoryService
 */
export const deductInventoryForProduction = async (ingredients) => {
  const results = [];

  for (const ingredient of ingredients) {
    const { inventoryItemId, amountDeducted } = ingredient;

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });

    if (!inventoryItem) {
      throw new Error(`Inventory item with ID ${inventoryItemId} not found.`);
    }

    if (inventoryItem.currentQuantity < amountDeducted) {
      throw new Error(`Not enough stock for inventory item ${inventoryItem.name}.`);
    }

    const costOfDeduction = inventoryItem.cost * amountDeducted;

    await prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: {
        currentQuantity: {
          decrement: amountDeducted,
        },
      },
    });

    results.push({
      inventoryItemId,
      amountDeducted,
      cost: costOfDeduction,
    });
  }

  return results;
};

export const getInventorySummary = async () => {
  const lowStockItems = await prisma.inventoryItem.findMany({
    where: {
      currentQuantity: {
        lt: prisma.inventoryItem.fields.minLevel,
      },
      NOT: {
        currentQuantity: 0,
      },
    },
    select: {
      id: true,
      name: true,
      currentQuantity: true,
      minLevel: true,
      type: true,
    },
  });

  const outOfStockItems = await prisma.inventoryItem.findMany({
    where: {
      currentQuantity: {
        equals: 0,
      },
    },
    select: {
      id: true,
      name: true,
      currentQuantity: true,
      minLevel: true,
      type: true,
    },
  });

  // Materials Used
  const materialsUsed = await prisma.productionIngredientDeduction.findMany({
    include: {
      inventoryItem: { select: { name: true, unit: true } },
      productionRun: { select: { product: { select: { name: true } }, quantityProduced: true } },
    },
    take: 5,
  });

  const formattedMaterialsUsed = materialsUsed.map(item => ({
    materialName: item.inventoryItem.name,
    amountDeducted: item.amountDeducted,
    unit: item.inventoryItem.unit,
    productName: item.productionRun.product.name,
    quantityProduced: item.productionRun.quantityProduced,
  }));

  // Top Selling Products (last 5 days)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  fiveDaysAgo.setHours(0, 0, 0, 0);

  const topSellingProductsRaw = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
    },
    where: {
      sale: {
        createdAt: {
          gte: fiveDaysAgo,
        },
      },
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5, // Get top 5 products
  });

  const topSellingProducts = await Promise.all(
    topSellingProductsRaw.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });
      return {
        productName: product ? product.name : 'Unknown Product',
        totalQuantitySold: item._sum.quantity,
      };
    })
  );

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyAdjustments = await prisma.inventoryAdjustment.findMany({
    where: {
      createdAt: {
        gte: startOfWeek,
      },
    },
    include: {
      inventoryItem: {
        select: {
          name: true,
          unit: true,
        },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedAdjustments = weeklyAdjustments.map(adj => ({
    itemName: adj.inventoryItem.name,
    amount: adj.amount,
    unit: adj.inventoryItem.unit,
    reason: adj.reason,
    createdBy: adj.createdBy.name,
    createdAt: adj.createdAt,
  }));

  return {
    lowStock: {
      count: lowStockItems.length,
      items: lowStockItems,
    },
    outOfStock: {
      count: outOfStockItems.length,
      items: outOfStockItems,
    },
    materialsUsed: {
      count: formattedMaterialsUsed.length,
      items: formattedMaterialsUsed,
    },
    topSellingProducts: {
      count: topSellingProducts.length,
      items: topSellingProducts,
    },
    weeklyAdjustments: {
      count: formattedAdjustments.length,
      items: formattedAdjustments,
    },
  };
};
