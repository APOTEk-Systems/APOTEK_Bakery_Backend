import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Converts price to base units for storage (per gram/ml for raw materials)
 * @param {number} price - The price in the given unit
 * @param {string} unit - The unit (kg, g, l, ml, etc.)
 * @param {string} type - The inventory type (raw_material, packaging, etc.)
 * @returns {number} Price in base units
 */
export const convertPriceToBaseUnits = (price, unit, type) => {
  if (type === "raw_material" && (unit === "kg" || unit === "l")) {
    return price / 1000; // Convert to per gram/ml
  }
  return price;
};

/**
 * Converts quantity to base units for storage (grams/ml for raw materials)
 * @param {number} quantity - The quantity in the given unit
 * @param {string} unit - The unit (kg, g, l, ml, etc.)
 * @param {string} type - The inventory type (raw_material, packaging, etc.)
 * @returns {number} Quantity in base units
 */
export const convertQuantityToBaseUnits = (quantity, unit, type) => {
  if (type === "raw_material" && (unit === "kg" || unit === "l")) {
    return quantity * 1000; // Convert to grams/ml
  }
  return quantity;
};

/**
 * Converts price from base units for display (per kg/l for raw materials)
 * @param {number} price - The price in base units
 * @param {string} unit - The unit (kg, g, l, ml, etc.)
 * @param {string} [type] - The inventory type (raw_material, packaging, etc.)
 * @returns {number} Price in display units
 */
export const convertPriceFromBaseUnits = (price, unit, type = "raw_material") => {
  if (type === "raw_material" && (unit === "kg" || unit === "l")) {
    return price * 1000; // Convert to per kg/l
  }
  return price;
};

/**
 * Converts quantity from base units for display (kg/l for raw materials)
 * @param {number} quantity - The quantity in base units
 * @param {string} unit - The unit (kg, g, l, ml, etc.)
 * @param {string} [type] - The inventory type (raw_material, packaging, etc.)
 * @returns {number} Quantity in display units
 */
export const convertQuantityFromBaseUnits = (quantity, unit, type = "raw_material") => {
  if (type === "raw_material" && (unit === "kg" || unit === "l")) {
    return quantity / 1000; // Convert to kg/l
  }
  return quantity;
};

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

  // Convert prices and quantities back to display units for frontend
  const convertedItems = items.map(item => ({
    ...item,
    cost: convertPriceFromBaseUnits(item.cost, item.unit, item.type),
    currentQuantity: convertQuantityFromBaseUnits(item.currentQuantity, item.unit, item.type),
  }));

 // console.log("Converted Items:", convertedItems);

  return convertedItems.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Creates a new inventory item.
 * @param {object} inventoryItemData - The data for the new inventory item.
 * @param {number} userId - The ID of the user creating the inventory item.
 * @returns {Promise<object>} A promise that resolves to the newly created inventory item.
 * @memberof InventoryService
 */
export const createInventoryItem = async (inventoryItemData, userId) => {
  const { cost, unit, type, currentQuantity, ...rest } = inventoryItemData;

  // Convert price to base units for storage
  const convertedCost = convertPriceToBaseUnits(cost, unit, type);

  // Convert quantity to base units for storage
  const convertedQuantity = convertQuantityToBaseUnits(currentQuantity, unit, type);

  const data = {
    ...rest,
    cost: convertedCost,
    unit,
    type,
    currentQuantity: convertedQuantity,
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
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
  });

  if (!item) return null;

  // Convert back to display units for frontend
  return {
    ...item,
    cost: convertPriceFromBaseUnits(item.cost, item.unit, item.type),
    currentQuantity: convertQuantityFromBaseUnits(item.currentQuantity, item.unit, item.type),
  };
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
  const { cost, unit, type, currentQuantity, ...rest } = inventoryItemData;

  // Get existing item to know the type and unit
  const existingItem = await prisma.inventoryItem.findUnique({
    where: { id },
  });

  if (!existingItem) {
    throw new Error("Inventory item not found");
  }

  // Convert price and quantity to base units for storage
  const convertedCost = cost !== undefined ? convertPriceToBaseUnits(cost, unit || existingItem.unit, type || existingItem.type) : undefined;
  const convertedQuantity = currentQuantity !== undefined ? convertQuantityToBaseUnits(currentQuantity, unit || existingItem.unit, type || existingItem.type) : undefined;

  const data = {
    ...rest,
    ...(convertedCost !== undefined && { cost: convertedCost }),
    ...(convertedQuantity !== undefined && { currentQuantity: convertedQuantity }),
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
    const { inventoryItemId, amountDeducted, unit } = ingredient;

    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });

    if (!inventoryItem) {
      throw new Error(`Inventory item with ID ${inventoryItemId} not found.`);
    }

    // Convert amountDeducted to base units for comparison and deduction
    const amountDeductedBase = convertQuantityToBaseUnits(amountDeducted, unit, inventoryItem.type);

    if (inventoryItem.currentQuantity < amountDeductedBase) {
      throw new Error(
        `Not enough stock for inventory item ${inventoryItem.name}.`
      );
    }

    // Cost is already stored in base units, so costOfDeduction is correct
    const costOfDeduction = inventoryItem.cost * amountDeductedBase;

    await prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: {
        currentQuantity: {
          decrement: amountDeductedBase,
        },
      },
    });

    results.push({
      inventoryItemId,
      amountDeducted: amountDeductedBase, // Store in base units
      cost: costOfDeduction,
      unit
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
      productionRun: {
        select: { product: { select: { name: true } }, quantityProduced: true },
      },
    },
    take: 5,
  });

  const formattedMaterialsUsed = materialsUsed.map((item) => ({
    materialName: item.inventoryItem.name,
    amountDeducted: convertQuantityFromBaseUnits(
      item.amountDeducted,
      item.inventoryItem.unit,
      item.inventoryItem.type
    ),
    unit: item.inventoryItem.unit,
    productName: item.productionRun.product.name,
    quantityProduced: item.productionRun.quantityProduced,
  }));

  // Top Selling Products (last 5 days)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  fiveDaysAgo.setHours(0, 0, 0, 0);

  const topSellingProductsRaw = await prisma.saleItem.groupBy({
    by: ["productId"],
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
        quantity: "desc",
      },
    },
    take: 5, // Get top 5 products
  });

  const topSellingProducts = await Promise.all(
    topSellingProductsRaw.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, quantity: true },
      });

      const salesCount = await prisma.saleItem.count({
        where: {
          productId: item.productId,
          sale: {
            createdAt: {
              gte: fiveDaysAgo,
            },
          },
        },
      });

      return {
        productName: product ? product.name : "Unknown Product",
        totalQuantitySold: item._sum.quantity,
        numberOfSales: salesCount,
        quantityOnHand: product ? product.quantity : 0,
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
      createdAt: "desc",
    },
  });

  const formattedAdjustments = weeklyAdjustments.map((adj) => ({
    itemName: adj.inventoryItem.name,
    amount: convertQuantityFromBaseUnits(
      adj.amount,
      adj.inventoryItem.unit,
      adj.inventoryItem.type
    ),
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
