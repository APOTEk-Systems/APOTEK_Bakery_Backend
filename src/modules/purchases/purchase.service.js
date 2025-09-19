
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @namespace PurchaseService
 * @description Handles all purchase-related business logic.
 */

/**
 * Retrieves all purchase orders from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of purchase orders.
 * @memberof PurchaseService
 */
export const getAllPurchaseOrders = async ({ status }) => {
  const where = {};
  if (status) {
    where.status = status;
  }
  return await prisma.purchaseOrder.findMany({
    where,
    include: { items: true, goodsReceipts: true },
  });
};

/**
 * Creates a new purchase order.
 * @param {object} purchaseOrderData - The data for the new purchase order.
 * @returns {Promise<object>} A promise that resolves to the newly created purchase order.
 * @memberof PurchaseService
 */
export const createPurchaseOrder = async (purchaseOrderData, userId) => {
  const { items, supplierId, ...rest } = purchaseOrderData;
  return await prisma.purchaseOrder.create({
    data: {
      ...rest,
      supplier: { connect: { id: supplierId } },
      createdBy: { connect: { id: userId } },
      items: {
        create: items,
      },
    },
    include: { items: true },
  });
};

/**
 * Retrieves all goods receipts from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of goods receipts.
 * @memberof PurchaseService
 */
export const getAllGoodsReceipts = async ({ status }) => {
  const where = {};
  if (status) {
    where.status = status;
  }
  return await prisma.goodsReceipt.findMany({ where });
};

/**
 * Creates a new goods receipt and updates inventory.
 * @param {object} goodsReceiptData - The data for the new goods receipt.
 * @param {number} userId - The ID of the user creating the receipt.
 * @returns {Promise<object>} A promise that resolves to the newly created goods receipt.
 * @memberof PurchaseService
 */
export const createGoodsReceipt = async (goodsReceiptData, userId) => {
  const { purchaseOrderId, items, ...rest } = goodsReceiptData;

  return await prisma.$transaction(async (tx) => {
    let totalReceivedQuantity = 0;
    for (const item of items) {
      totalReceivedQuantity += item.receivedQuantity;
    }

    // 1. Create the GoodsReceipt
    const goodsReceipt = await tx.goodsReceipt.create({
      data: {
        ...rest,
        purchaseOrder: { connect: { id: purchaseOrderId } },
        createdBy: { connect: { id: userId } },
        receivedQuantity: totalReceivedQuantity,
      },
    });

    // 2. Update inventory for each item in the receipt
    for (const item of items) {
      await tx.inventoryItem.update({
        where: { id: item.inventoryItemId },
        data: { currentQuantity: { increment: item.receivedQuantity } },
      });
    }

    return goodsReceipt;
  }, {
    maxWait: 5000, // default: 2000
    timeout: 10000, // default: 5000
  });
};


/**
 * Retrieves a single purchase order by its ID.
 * @param {string} id - The ID of the purchase order to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the purchase order object if found, or null otherwise.
 * @memberof PurchaseService
 */
export const getPurchaseOrderById = async (id) => {
  return await prisma.purchaseOrder.findUnique({ where: { id: parseInt(id) }, include:{items:true} });
};

/**
 * Updates an existing purchase order.
 * @param {string} id - The ID of the purchase order to update.
 * @param {object} purchaseOrderData - The updated data for the purchase order.
 * @returns {Promise<object>} A promise that resolves to the updated purchase order object.
 * @memberof PurchaseService
 */
export const updatePurchaseOrder = async (id, purchaseOrderData) => {
  return await prisma.purchaseOrder.update({ where: { id: parseInt(id) }, data: purchaseOrderData , include:{supplier:true, items:true}});
};

/**
 * Updates an existing purchase order's status.
 * @param {string} id - The ID of the purchase order to update.
 * @param {string} status - The new status for the purchase order.
 * @returns {Promise<object>} A promise that resolves to the updated purchase order object.
 * @memberof PurchaseService
 */
export const updatePurchaseOrderStatus = async (id, status) => {
  return await prisma.purchaseOrder.update({
    where: { id: parseInt(id) },
    data: { status },
    include:{
      supplier:true,
      items:true,
    }
  });
};

/**
 * Deletes a purchase order by its ID.
 * @param {string} id - The ID of the purchase order to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted purchase order object.
 * @memberof PurchaseService
 */
export const deletePurchaseOrder = async (id) => {
  const purchaseOrderId = parseInt(id);
  await prisma.purchaseOrderItem.deleteMany({ where: { purchaseOrderId } });
  return await prisma.purchaseOrder.delete({ where: { id: purchaseOrderId } });
};

/**
 * Retrieves a single goods receipt by its ID.
 * @param {string} id - The ID of the goods receipt to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the goods receipt object if found, or null otherwise.
 * @memberof PurchaseService
 */
export const getGoodsReceiptById = async (id) => {
  return await prisma.goodsReceipt.findUnique({ where: { id: parseInt(id) } });
};

/**
 * Updates an existing goods receipt.
 * @param {string} id - The ID of the goods receipt to update.
 * @param {object} goodsReceiptData - The updated data for the goods receipt.
 * @returns {Promise<object>} A promise that resolves to the updated goods receipt object.
 * @memberof PurchaseService
 */
export const updateGoodsReceipt = async (id, goodsReceiptData) => {
  return await prisma.goodsReceipt.update({ where: { id: parseInt(id) }, data: goodsReceiptData });
};

/**
 * Deletes a goods receipt by its ID.
 * @param {string} id - The ID of the goods receipt to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted goods receipt object.
 * @memberof PurchaseService
 */
export const deleteGoodsReceipt = async (id) => {
  return await prisma.goodsReceipt.delete({ where: { id: parseInt(id) } });
};

export const getPurchaseSummary = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const firstDayOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0);

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: {
      createdAt: {
        gte: firstDayOfLastMonth,
      },
    },
  });

  const currentMonthPurchases = purchaseOrders.filter(
    (po) =>
      (po.status === "approved" || po.status === "completed") &&
      po.createdAt >= firstDayOfMonth &&
      po.createdAt <= lastDayOfMonth
  );

  const lastMonthPurchases = purchaseOrders.filter(
    (po) =>
      (po.status === "approved" || po.status === "completed") &&
      po.createdAt >= firstDayOfLastMonth &&
      po.createdAt < firstDayOfMonth
  );

  const totalPurchasesThisMonth = currentMonthPurchases.reduce(
    (sum, po) => sum + po.totalCost,
    0
  );

  const totalPurchasesLastMonth = lastMonthPurchases.reduce(
    (sum, po) => sum + po.totalCost,
    0
  );

  const pendingPurchaseOrders = purchaseOrders.filter(
    (po) => po.status === "pending"
  ).length;

  const purchaseGrowth =
    totalPurchasesLastMonth > 0
      ? (
          ((totalPurchasesThisMonth - totalPurchasesLastMonth) / totalPurchasesLastMonth) *
          100
        ).toFixed(2)
      : totalPurchasesThisMonth > 0
      ? "100.00"
      : "0.00";

  // Weekly Purchases Aggregation (last 4 weeks)
  const weeklyPurchasesList = [];
  for (let i = 0; i < 4; i++) {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() - (7 * i));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const purchasesInWeek = await prisma.purchaseOrder.findMany({
      where: {
        status: { in: ["approved", "completed"] },
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    const totalWeeklyPurchases = purchasesInWeek.reduce(
      (sum, po) => sum + po.totalCost,
      0
    );

    weeklyPurchasesList.unshift({
      weekStart: startOfWeek.toISOString().split('T')[0],
      total: totalWeeklyPurchases,
    });
  }

  return {
    totalPurchasesThisMonth,
    pendingPurchaseOrders,
    purchaseGrowth,
    weeklyPurchasesList,
  };
};

