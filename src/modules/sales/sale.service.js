
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @namespace SaleService
 * @description Handles all sale-related business logic.
 */

/**
 * Retrieves all sales from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of sales.
 * @memberof SaleService
 */
export const getAllSales = async ({ date, isCredit, status }) => {
  const where = {};
  if (date) {
    where.createdAt = {
      gte: new Date(date),
      lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    };
  }
  if (isCredit) {
    where.isCredit = isCredit === 'true';
  }
  if (status) {
    where.status = status;
  }
  return await prisma.sale.findMany({
    where,
    include: { items: true, customer: true },
  });
};

/**
 * Creates a new sale.
 * @param {object} saleData - The data for the new sale.
 * @returns {Promise<object>} A promise that resolves to the newly created sale.
 * @memberof SaleService
 */
export const createSale = async (saleData, userId) => {
  const { items, customerId, isCredit, total, ...rest } = saleData;

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Check for product existence and credit in parallel
      const productExistenceChecks = items.map(item =>
        tx.product.findUnique({ where: { id: item.productId } })
      );

      const creditCheck = isCredit
        ? tx.customer.findUnique({ where: { id: customerId } })
        : Promise.resolve(null);

      const [products, customer] = await Promise.all([
        Promise.all(productExistenceChecks),
        creditCheck,
      ]);

      // 2. Validate products
      products.forEach((product, index) => {
        if (!product) {
          throw new Error(`Product with id ${items[index].productId} not found.`);
        }
      });

      // 3. Validate customer and credit
      if (isCredit) {
        if (!customerId) {
          throw new Error('customerId is required for credit sales.');
        }
        if (!customer) {
          throw new Error('Customer not found');
        }
        const currentCredit = customer.currentCredit || 0;
        if (customer.creditLimit !== null && currentCredit + total > customer.creditLimit) {
          throw new Error('Credit limit exceeded');
        }
      }

      // 4. Create the sale
      const saleInput = {
        ...rest,
        total,
        isCredit,
        status: isCredit ? 'unpaid' : 'completed',
        soldBy: { connect: { id: userId } },
        items: {
          create: items,
        },
      };

      if (customerId) {
        saleInput.customer = { connect: { id: customerId } };
      }

      const sale = await tx.sale.create({
        data: saleInput,
        include: { items: true },
      });

      // 5. Update customer credit and product quantities in parallel
      const customerUpdate = isCredit
        ? tx.customer.update({
            where: { id: customerId },
            data: { currentCredit: { increment: total } },
          })
        : Promise.resolve();

      const productUpdates = items.map(item =>
        tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        })
      );

      await Promise.all([customerUpdate, ...productUpdates]);

      return sale;
    },
    {
      maxWait: 15000, // default: 2000
      timeout: 15000, // default: 5000
    });
  } catch (err) {
    console.log(err);
    // Re-throw the original error to be caught by the controller
    throw err;
  }
};

/**
 * Retrieves a single sale by its ID.
 * @param {string} id - The ID of the sale to retrieve.
 * @returns {Promise<object|null>} A promise that resolves to the sale object if found, or null otherwise.
 * @memberof SaleService
 */
export const getSaleById = async (id) => {
  return await prisma.sale.findUnique({ where: { id } });
};

/**
 * Updates an existing sale.
 * @param {string} id - The ID of the sale to update.
 * @param {object} saleData - The updated data for the sale.
 * @returns {Promise<object>} A promise that resolves to the updated sale object.
 * @memberof SaleService
 */
export const updateSale = async (id, saleData) => {
  return await prisma.sale.update({ where: { id }, data: saleData });
};

/**
 * Pays a sale.
 * @param {number} saleId - The ID of the sale to pay.
 * @returns {Promise<object>} A promise that resolves to the paid sale object.
 * @memberof SaleService
 */
export const paySale = async (saleId) => {
  const sale = await prisma.sale.findUnique({ where: { id: saleId } });
  if (!sale) {
    throw new Error('Sale not found');
  }

  if (sale.status === 'completed') {
    throw new Error('Sale is already paid');
  }

  if (!sale.isCredit) {
    throw new Error('Sale is not a credit sale');
  }

  return await prisma.$transaction(async (tx) => {
    const updatedSale = await tx.sale.update({
      where: { id: saleId },
      data: { status: 'completed' },
    });

    await tx.customer.update({
      where: { id: sale.customerId },
      data: { currentCredit: { decrement: sale.total } },
    });

    return updatedSale;
  });
};

/**
 * Deletes a sale by its ID.
 * @param {string} id - The ID of the sale to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted sale object.
 * @memberof SaleService
 */
export const deleteSale = async (id) => {
  const saleId = parseInt(id);
  await prisma.saleItem.deleteMany({ where: { saleId } });
  return await prisma.sale.delete({ where: { id: saleId } });
};
