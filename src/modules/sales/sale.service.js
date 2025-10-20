
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
export const getAllSales = async ({
  date,
  isCredit,
  status,
  limit,
  endDate,
  startDate,
  page,
  customerName,
}) => {
  const where = {};

  if (date) {
    where.createdAt = {
      gte: new Date(date),
      lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    };
  }

  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
    };
  }

  if (isCredit) {
    where.isCredit = isCredit === 'true';
  }

  if (status) {
    where.status = status;
  }

  if (customerName) {
    if (customerName.toLowerCase() === 'cash') {
      where.customerId = null;
    } else {
      where.customer = {
        name: {
          contains: customerName,
          mode: 'insensitive',
        },
      };
    }
  }

  const salesRaw = await prisma.sale.findMany({
    where,
    include: { items: true, customer: true, soldBy: { select: { name: true } }, creditPayments: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.sale.count({ where });

  const sales = salesRaw.map(sale => {
    const { soldBy, creditPayments, ...rest } = sale;
    const totalPaid = creditPayments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingBalance = sale.isCredit ? sale.total - totalPaid : 0;

    return {
      ...rest,
      soldBy: soldBy ? soldBy.name : 'N/A',
      outstandingBalance,
      paid: totalPaid,
    };
  });

  return {
    sales,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
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

      let outstandingPayments = null;
      if (isCredit) {
        const updatedCustomer = await tx.customer.findUnique({
          where: { id: customerId },
        });
        outstandingPayments = updatedCustomer.currentCredit;
      }

      return { sale, outstandingPayments };
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
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
      customer: true,
      creditPayments: true,
    },
  });

  if (!sale) return null;

  const totalPaid = sale.creditPayments.reduce((sum, p) => sum + p.amount, 0);

  // Move product name into each item
  const itemsWithProductName = sale.items.map(item => ({
    ...item,
    name: item.product.name,
    product: undefined, // optional: remove the original product object
  }));

  return {
    ...sale,
    items: itemsWithProductName,
    paid: totalPaid,
  };
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

export const createCreditPayment = async (saleId, paymentData, userId) => {
  const { amount, notes } = paymentData;

  return await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: { creditPayments: true },
    });

    if (!sale) {
      throw new Error('Sale not found');
    }

    if (!sale.isCredit) {
      throw new Error('This is not a credit sale.');
    }

    const totalPaid = sale.creditPayments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingAmount = sale.total - totalPaid;

    if (amount > outstandingAmount) {
      throw new Error(`Payment amount cannot exceed the outstanding amount of ${outstandingAmount}.`);
    }

    const customer = await tx.customer.findUnique({ where: { id: sale.customerId } });

    if (!customer) {
      throw new Error('Customer not found for this sale.');
    }

    // 1. Create the credit payment
    const payment = await tx.creditPayment.create({
      data: {
        amount,
        notes,
        saleId,
        customerId: sale.customerId,
      },
    });

    // 2. Update customer's current credit balance
    await tx.customer.update({
      where: { id: sale.customerId },
      data: { currentCredit: { decrement: amount } },
    });

    // 3. Update the sale's payment status
    const newTotalPaid = totalPaid + amount;
    let newPaymentStatus = 'PARTIALLY_PAID';
    let newStatus = sale.status;
    if (newTotalPaid >= sale.total) {
      newPaymentStatus = 'PAID';
      newStatus = 'completed';
    }

    await tx.sale.update({
      where: { id: saleId },
      data: { 
        paymentStatus: newPaymentStatus,
        status: newStatus
       },
    });

    return payment;
  });
};

export const getPaymentsForSale = async (saleId) => {
  return await prisma.creditPayment.findMany({
    where: { saleId },
    orderBy: { paymentDate: 'desc' },
  });
};

export const getAllCreditPayments = async () => {
  return await prisma.creditPayment.findMany({
    include:{ customer: true },
    orderBy: { paymentDate: 'desc' },
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

export const getSalesSummary = async () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const firstDayOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0);

  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: firstDayOfLastMonth,
      },
    },
  });

  const currentMonthSales = sales.filter(
    (sale) => sale.createdAt >= firstDayOfMonth && sale.createdAt <= lastDayOfMonth
  );

  const lastMonthSales = sales.filter(
    (sale) => sale.createdAt >= firstDayOfLastMonth && sale.createdAt < firstDayOfMonth
  );

  const totalSalesThisMonth = currentMonthSales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const totalSalesLastMonth = lastMonthSales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const daysInMonth = lastDayOfMonth.getDate();
  const averageDailySales = totalSalesThisMonth / daysInMonth;

  // Weekly Sales Aggregation (last 4 weeks)
  const weeklySalesList = [];
  for (let i = 0; i < 4; i++) {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() - (7 * i));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const salesInWeek = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    const totalWeeklySales = salesInWeek.reduce((sum, sale) => sum + sale.total, 0);

    weeklySalesList.unshift({
      weekStart: startOfWeek.toISOString().split('T')[0],
      total: totalWeeklySales,
    });
  }

  return {
    totalSalesThisMonth,
    averageDailySales,
    salesGrowth: {
      current: totalSalesThisMonth,
      previous: totalSalesLastMonth,
    },
    weeklySalesList,
  };
};
