import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @namespace SalesAdjustmentService
 * @description Handles all sales adjustment-related business logic.
 */

/**
 * Creates a new sales adjustment request.
 * @param {object} adjustmentData - The data for the new sales adjustment.
 * @param {number} adjustmentData.saleId - The ID of the sale to adjust.
 * @param {string} adjustmentData.reason - The reason for the adjustment.
 * @param {Array} adjustmentData.items - Array of items to adjust.
 * @param {number} adjustmentData.requestedById - The ID of the user requesting the adjustment.
 * @returns {Promise<object>} A promise that resolves to the newly created sales adjustment.
 * @memberof SalesAdjustmentService
 */
export const createSalesAdjustment = async ({ saleId, reason, items, requestedById }) => {
  // Step 1: Validate sale exists and is valid
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      items: {
        include: { product: true }
      },
      customer: true
    }
  });

  if (!sale) {
    throw new Error('Sale not found');
  }

  // Step 2: Check if sale is in a valid status
  if (sale.status === 'cancelled') {
    throw new Error('Cannot create adjustment for a cancelled sale');
  }

  if (sale.status === 'refunded') {
    throw new Error('Cannot create adjustment for a fully refunded sale');
  }

  // Step 3: Check for existing pending adjustments
  const existingPendingAdjustments = await prisma.salesAdjustment.findMany({
    where: {
      saleId: saleId,
      status: 'PENDING'
    }
  });

  if (existingPendingAdjustments.length > 0) {
    throw new Error('There is already a pending adjustment for this sale. Please approve or decline the existing adjustment first.');
  }

  // Step 4: Validate requested items against original sale
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('At least one item must be specified for adjustment');
  }

  // Check that all requested items exist in the original sale
  const saleItemMap = new Map();
  sale.items.forEach(item => {
    saleItemMap.set(item.productId, item);
  });

  for (const requestedItem of items) {
    const { productId, quantity } = requestedItem;

    // Validate positive quantity
    if (!quantity || quantity <= 0) {
      throw new Error(`Invalid quantity for product ${productId}. Quantity must be greater than 0`);
    }

    // Check if product exists in the original sale
    const saleItem = saleItemMap.get(productId);
    if (!saleItem) {
      throw new Error(`Product ${productId} is not part of sale ${saleId}`);
    }

    // Check if requested quantity doesn't exceed original quantity
    if (quantity > saleItem.quantity) {
      throw new Error(`Requested quantity (${quantity}) for product ${productId} exceeds the original sale quantity (${saleItem.quantity})`);
    }

    // Check if this quantity has already been adjusted (partially)
    const existingAdjustments = await prisma.salesAdjustmentItem.findMany({
      where: {
        salesAdjustment: {
          saleId: saleId,
          status: 'APPROVED'
        },
        productId: productId
      }
    });

    const totalAlreadyAdjusted = existingAdjustments.reduce((sum, item) => sum + item.quantity, 0);
    const remainingQuantity = saleItem.quantity - totalAlreadyAdjusted;

    if (quantity > remainingQuantity) {
      throw new Error(`Product ${productId} has already been adjusted by ${totalAlreadyAdjusted} units. Only ${remainingQuantity} units remain available for adjustment`);
    }
  }

  // Step 5: Create the sales adjustment
  const salesAdjustment = await prisma.salesAdjustment.create({
    data: {
      sale: { connect: { id: saleId } },
      reason,
      requestedBy: { connect: { id: requestedById } },
      items: {
        createMany: {
          data: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
    },
    include: {
      items: {
        include: { product: true }
      },
      sale: {
        include: {
          items: {
            include: { product: true }
          },
          customer: true
        }
      },
      requestedBy: {
        select: {
          id: true,
          name: true
        }
      },
    },
  });

  return salesAdjustment;
};

/**
 * Retrieves sales adjustments with optional filtering and pagination.
 * @param {object} filters - Filters for sales adjustments (status, saleId, page, limit).
 * @param {string} [filters.status] - Filter by status (PENDING, APPROVED, DECLINED).
 * @param {number} [filters.saleId] - Filter by sale ID.
 * @param {number} [filters.page] - Page number for pagination (default: 1).
 * @param {number} [filters.limit] - Number of records per page (default: 10).
 * @returns {Promise<object>} A promise that resolves to paginated sales adjustments.
 * @memberof SalesAdjustmentService
 */
export const getSalesAdjustments = async ({ status, saleId, page = 1, limit = 10 }) => {
  const where = {};
  
  if (status) {
    where.status = status.toUpperCase();
  }
  
  if (saleId) {
    where.saleId = saleId;
  }

  const total = await prisma.salesAdjustment.count({ where });

  const returns = await prisma.salesAdjustment.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      sale: true,
      requestedBy: {
        select: {
          id: true,
          name: true,
        },
      },
      approvedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { 
    returns,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

/**
 * Approves a sales adjustment request.
 * @param {number} adjustmentId - The ID of the adjustment to approve.
 * @param {number} approvedById - The ID of the user approving the adjustment.
 * @returns {Promise<object>} A promise that resolves to the approved sales adjustment.
 * @memberof SalesAdjustmentService
 */
export const approveAdjustment = async (adjustmentId, approvedById) => {
  // 1. Fetch the sales adjustment with its items and the associated sale and products
  const adjustment = await prisma.salesAdjustment.findUnique({
    where: { id: adjustmentId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      sale: {
        include: {
          customer: true,
          items: true,
        },
      },
    },
  });

  if (!adjustment) {
    throw new Error('Sales adjustment not found');
  }

  if (adjustment.status !== 'PENDING') {
    throw new Error(`Sales adjustment cannot be approved. Current status: ${adjustment.status}`);
  }

  // Additional validation: Check if sale is still valid
  if (adjustment.sale.status === 'cancelled') {
    throw new Error('Cannot approve adjustment for a cancelled sale');
  }

  // Validate that all adjustment items still exist in the sale
  for (const adjustmentItem of adjustment.items) {
    const saleItem = adjustment.sale.items.find(si => si.productId === adjustmentItem.productId);
    if (!saleItem) {
      throw new Error(`Product ${adjustmentItem.productId} is no longer part of the original sale`);
    }

    // Check if the quantity to be returned is still available
    const currentQuantity = saleItem.quantity;
    if (adjustmentItem.quantity > currentQuantity) {
      throw new Error(`Product ${adjustmentItem.productId} quantity has changed. Available: ${currentQuantity}, Requested: ${adjustmentItem.quantity}`);
    }
  }

  // Calculate VAT percentage from original sale
  const originalSubtotal = adjustment.sale.subtotal ? parseFloat(adjustment.sale.subtotal) : adjustment.sale.total;
  const originalVAT = adjustment.sale.vat ? parseFloat(adjustment.sale.vat) : 0;
  const originalTotal = adjustment.sale.total;
  
  // Smart VAT calculation: derive VAT percentage from original sale
  let vatPercentage = 0;
  if (originalSubtotal > 0) {
    vatPercentage = (originalVAT / originalSubtotal) * 100;
  }

  let totalReturnAmount = 0;
  const itemUpdates = [];

  // Use a transaction to ensure atomicity and rollback on any error
  try {
    const updatedAdjustment = await prisma.$transaction(async (tx) => {
      // 2. Restock inventory for each item and calculate return value
      for (const item of adjustment.items) {
        // Restock inventory
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
        
        // Find the corresponding sale item to get the exact price
        const saleItem = adjustment.sale.items.find(si => si.productId === item.productId);
        const itemPrice = saleItem ? saleItem.price : item.product.price;
        const itemReturnValue = item.quantity * itemPrice;
        
        totalReturnAmount += itemReturnValue;
        itemUpdates.push({
          saleItemId: saleItem.id,
          returnQuantity: item.quantity,
          newQuantity: saleItem.quantity - item.quantity,
        });
      }

      // 3. Update sale items (reduce quantities or remove if fully returned)
      for (const update of itemUpdates) {
        if (update.newQuantity <= 0) {
          // Remove the item entirely if quantity becomes 0 or negative
          await tx.saleItem.delete({
            where: { id: update.saleItemId },
          });
        } else {
          // Update the quantity
          await tx.saleItem.update({
            where: { id: update.saleItemId },
            data: {
              quantity: update.newQuantity,
            },
          });
        }
      }

      // 4. Calculate new subtotal, VAT, and total
      const newSubtotal = originalSubtotal - totalReturnAmount;
      const newVAT = newSubtotal * (vatPercentage / 100);
      const newTotal = newSubtotal + newVAT;

      // Ensure values don't go negative
      if (newSubtotal < 0 || newVAT < 0 || newTotal < 0) {
        throw new Error('Calculation resulted in negative values. Please verify the adjustment quantities.');
      }

      // 5. Update the original sale with new calculations
      await tx.sale.update({
        where: { id: adjustment.saleId },
        data: {
          subtotal: newSubtotal,
          vat: newVAT,
          total: newTotal,
          updatedAt: new Date(),
        },
      });

      // 6. Adjust customer credit if the original sale was on credit
      if (adjustment.sale.isCredit && adjustment.sale.customer) {
        await tx.customer.update({
          where: { id: adjustment.sale.customer.id },
          data: {
            currentCredit: {
              decrement: totalReturnAmount, // Decrement credit as it's a return
            },
          },
        });
      }

      // TODO: 7. Create accounting entries for the return
      // This would involve creating new records in an 'AccountingEntry' or 'Transaction' model.

      // 8. Update the sales adjustment status to APPROVED
      return await tx.salesAdjustment.update({
        where: { id: adjustmentId },
        data: {
          status: 'APPROVED',
          approvedBy: { connect: { id: approvedById } },
          updatedAt: new Date(),
        },
        include: {
          items: true,
          sale: {
            include: {
              items: true,
              customer: true,
            },
          },
          requestedBy: true,
          approvedBy: true,
        },
      });
    });

    // Calculate final values for the summary
    const finalNewSubtotal = originalSubtotal - totalReturnAmount;
    const finalNewVAT = finalNewSubtotal * (vatPercentage / 100);
    const finalNewTotal = finalNewSubtotal + finalNewVAT;

    return {
      ...updatedAdjustment,
      calculationSummary: {
        originalSubtotal: parseFloat(originalSubtotal.toFixed(2)),
        originalVAT: parseFloat(originalVAT.toFixed(2)),
        originalTotal: parseFloat(originalTotal.toFixed(2)),
        vatPercentage: vatPercentage.toFixed(2) + '%',
        returnAmount: parseFloat(totalReturnAmount.toFixed(2)),
        newSubtotal: parseFloat(finalNewSubtotal.toFixed(2)),
        newVAT: parseFloat(finalNewVAT.toFixed(2)),
        newTotal: parseFloat(finalNewTotal.toFixed(2)),
      },
    };
  } catch (error) {
    // If any error occurs during the transaction, all changes will be rolled back automatically
    console.error('Sales adjustment approval failed, transaction rolled back:', error);
    throw error;
  }
};

/**
 * Declines a sales adjustment request.
 * @param {number} adjustmentId - The ID of the adjustment to decline.
 * @param {number} declinedById - The ID of the user declining the adjustment.
 * @returns {Promise<object>} A promise that resolves to the declined sales adjustment.
 * @memberof SalesAdjustmentService
 */
export const declineAdjustment = async (adjustmentId, declinedById) => {
  const adjustment = await prisma.salesAdjustment.findUnique({
    where: { id: adjustmentId },
  });

  if (!adjustment || adjustment.status !== 'PENDING') {
    throw new Error('Sales adjustment not found or not in PENDING status.');
  }

  return await prisma.salesAdjustment.update({
    where: { id: adjustmentId },
    data: {
      status: 'DECLINED',
      declinedBy: { connect: { id: declinedById } },
      updatedAt: new Date(),
    },
    include: {
      items: true,
      sale: true,
      requestedBy: true,
      approvedBy: true,
    },
  });
};
