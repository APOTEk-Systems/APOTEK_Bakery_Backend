
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
  return await prisma.inventoryItem.findMany({ where });
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

export const getInventorySummary = async () => {
  const lowStockRawMaterials = await prisma.inventoryItem.findMany({
    where: {
      type: 'raw_material',
      currentQuantity: {
        lt: prisma.inventoryItem.fields.minLevel,
      },
    }, select:{
      id:true,
      name:true,
      minLevel:true
    }
  });

  const lowStockSupplies = await prisma.inventoryItem.findMany({
    where: {
      type: 'supply',
      currentQuantity: {
        lt: prisma.inventoryItem.fields.minLevel,
      },
    }, select:{
      id:true,
      name:true,
      minLevel:true
    }
  });

  const outOfStockItems = await prisma.inventoryItem.count({
    where: {
      currentQuantity: {
        equals: 0,
      },
    },
  });

  

  return {
    lowStockRawMaterials,
    lowStockSupplies,
    outOfStockItems,
  };
};
