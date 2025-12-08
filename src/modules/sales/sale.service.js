import { PrismaClient as MultiPrismaClient } from "../../generated/prisma-client/index.js";
const prisma = new MultiPrismaClient();

/**
 * @namespace SaleService
 * @description Handles all sale-related business logic.
 */

/**
 * Retrieves all sales from the database for a specific bakery.
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
  order
}, bakeryId) => {
  const where = { bakeryId };

  if (date) {
    where.createdAt = {
      gte: new Date(date),
      lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    };
  }

  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(new Date(startDate).setHours(0,0,0,0)),
      lt: new Date(new Date(endDate).setHours(23,59,59,999)),
    };
  }

  if (isCredit) {
    where.isCredit = isCredit === "true";
  }

  if (status) {
    where.status = status;
  }

 if (customerName) {
  const search = customerName.trim();

  if (search.toLowerCase() === "cash") {
    where.customerId = null;
  } else if (!isNaN(Number(search))) {
    // Search by sale ID
    where.id = Number(search);
  } else {
    // Search by customer name
    where.customer = {
      name: {
        contains: search,
        mode: "insensitive",
      },
    };
  }
}

  const salesRaw = await prisma.sale.findMany({
    where,
    include: {
      items: true,
      customer: true,
      soldBy: { select: { name: true } },
      creditPayments: true,
    },
    orderBy: { createdAt: order ? order : "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.sale.count({ where });

  const sales = salesRaw.map((sale) => {
    const { soldBy, creditPayments, ...rest } = sale;
    const totalPaid = creditPayments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingBalance = sale.isCredit ? sale.total - totalPaid : 0;

    return {
      ...rest,
      soldBy: soldBy ? soldBy.name : "N/A",
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
 * Creates a new sale within a specific bakery.
 * @param {object} saleData - The data for the new sale.
 * @param {number} userId - The ID of the user creating the sale.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object>} A promise that resolves to the newly created sale.
 * @memberof SaleService
 */
export const createSale = async (saleData, userId, bakeryId) => {
  const { items, customerId, isCredit, total, ...rest } = saleData;

  try {
    return await prisma.$transaction(
      async (tx) => {
        const productExistenceChecks = items.map((item) =>
          tx.product.findFirst({ where: { id: item.productId, bakeryId } })
        );

        const creditCheck = isCredit
          ? tx.customer.findFirst({ where: { id: customerId, bakeryId } })
          : Promise.resolve(null);

        const [products, customer] = await Promise.all([
          Promise.all(productExistenceChecks),
          creditCheck,
        ]);

        products.forEach((product, index) => {
          if (!product) {
            throw new Error(
              `Product with id ${items[index].productId} not found.`
            );
          }
        });

        if (isCredit) {
          if (!customerId) {
            throw new Error("customerId is required for credit sales.");
          }
          if (!customer) {
            throw new Error("Customer not found");
          }
          const currentCredit = customer.currentCredit || 0;
          if (
            customer.creditLimit !== null &&
            currentCredit + total > customer.creditLimit
          ) {
            throw new Error("Credit limit exceeded");
          }
        }

        const saleInput = {
          ...rest,
          total,
          isCredit,
          status: isCredit ? "unpaid" : "completed",
          soldBy: { connect: { id: userId } },
          items: {
            create: items.map(item => ({...item, bakeryId})),
          },
          bakeryId,
        };

        if (customerId) {
          saleInput.customer = { connect: { id: customerId } };
        }

        const sale = await tx.sale.create({
          data: saleInput,
          include: { items: true },
        });

        const customerUpdate = isCredit
          ? tx.customer.update({
              where: { id: customerId },
              data: { currentCredit: { increment: total } },
            })
          : Promise.resolve();

        const productUpdates = items.map((item) =>
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
        maxWait: 15000,
        timeout: 15000,
      }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Retrieves a single sale by its ID from a specific bakery.
 * @param {string} id - The ID of the sale to retrieve.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object|null>} A promise that resolves to the sale object if found, or null otherwise.
 * @memberof SaleService
 */
export const getSaleById = async (id, bakeryId) => {
  const sale = await prisma.sale.findFirst({
    where: { id, bakeryId },
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
  const outstandingBalance = sale.isCredit ? sale.total - totalPaid : 0;

  const itemsWithProductName = sale.items.map((item) => ({
    ...item,
    name: item.product.name,
    product: undefined,
  }));

  return {
    ...sale,
    items: itemsWithProductName,
    paid: totalPaid,
    outstandingBalance,
  };
};

/**
 * Updates an existing sale in a specific bakery.
 * @param {string} id - The ID of the sale to update.
 * @param {object} saleData - The updated data for the sale.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object>} A promise that resolves to the updated sale object.
 * @memberof SaleService
 */
export const updateSale = async (id, saleData, bakeryId) => {
    const sale = await prisma.sale.findFirst({ where: { id, bakeryId } });
    if (!sale) {
        throw new Error("Sale not found in this bakery");
    }
  return await prisma.sale.update({ where: { id }, data: saleData });
};

export const createCreditPayment = async (saleId, paymentData, userId, bakeryId) => {
  const { amount, notes } = paymentData;

  return await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findFirst({
      where: { id: saleId, bakeryId },
      include: { creditPayments: true },
    });

    if (!sale) {
      throw new Error("Sale not found");
    }

    if (!sale.isCredit) {
      throw new Error("This is not a credit sale.");
    }

    const totalPaid = sale.creditPayments.reduce((sum, p) => sum + p.amount, 0);
    const outstandingAmount = sale.total - totalPaid;

    if (amount > outstandingAmount) {
      throw new Error(
        `Payment amount cannot exceed the outstanding amount of ${outstandingAmount}.`
      );
    }

    const customer = await tx.customer.findFirst({
      where: { id: sale.customerId, bakeryId },
    });

    if (!customer) {
      throw new Error("Customer not found for this sale.");
    }

    const payment = await tx.creditPayment.create({
      data: {
        amount,
        notes,
        saleId,
        customerId: sale.customerId,
        receivedById: userId,
        bakeryId,
      },
      include: {
        receivedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    await tx.customer.update({
      where: { id: sale.customerId },
      data: { currentCredit: { decrement: amount } },
    });

    const newTotalPaid = totalPaid + amount;
    let newPaymentStatus = "PARTIALLY_PAID";
    let newStatus = sale.status;
    if (newTotalPaid >= sale.total) {
      newPaymentStatus = "PAID";
      newStatus = "completed";
    }

    await tx.sale.update({
      where: { id: saleId },
      data: {
        paymentStatus: newPaymentStatus,
        status: newStatus,
      },
    });

    return payment;
  });
};

export const getPaymentsForSale = async (saleId, bakeryId) => {
    const sale = await prisma.sale.findFirst({ where: { id: saleId, bakeryId } });
    if (!sale) {
        throw new Error("Sale not found in this bakery");
    }
  return await prisma.creditPayment.findMany({
    where: { saleId },
    include: {
      receivedBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { paymentDate: "desc" },
  });
};


export const getAllCreditPayments = async (bakeryId) => {
  return await prisma.creditPayment.findMany({
    where: { bakeryId },
    include: {
      customer: true,
      receivedBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { paymentDate: "desc" },
  });
};

/**
 * Deletes a sale by its ID from a specific bakery.
 * @param {string} id - The ID of the sale to delete.
 * @param {number} bakeryId - The ID of the bakery.
 * @returns {Promise<object>} A promise that resolves to the deleted sale object.
 * @memberof SaleService
 */
export const deleteSale = async (id, bakeryId) => {
  const saleId = parseInt(id);
  const sale = await prisma.sale.findFirst({ where: { id: saleId, bakeryId } });
    if (!sale) {
        throw new Error("Sale not found in this bakery");
    }
  await prisma.saleItem.deleteMany({ where: { saleId } });
  return await prisma.sale.delete({ where: { id: saleId } });
};

export const getSalesSummary = async (bakeryId) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const firstDayOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0);

  const sales = await prisma.sale.findMany({
    where: {
      bakeryId,
      createdAt: {
        gte: firstDayOfLastMonth,
      },
    },
  });

  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const dailySales = sales.filter(
    (sale) =>
      new Date(sale.createdAt) >= startOfDay &&
      new Date(sale.createdAt) <= endOfDay
  );

  const currentMonthSales = sales.filter(
    (sale) =>
      sale.createdAt >= firstDayOfMonth && sale.createdAt <= lastDayOfMonth
  );

  const lastMonthSales = sales.filter(
    (sale) =>
      sale.createdAt >= firstDayOfLastMonth && sale.createdAt < firstDayOfMonth
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

  const startOfCurrentWeek = new Date(now);
  startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Sunday as the start of the week
  startOfCurrentWeek.setHours(0, 0, 0, 0);

  const endOfCurrentWeek = new Date(startOfCurrentWeek);
  endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);
  endOfCurrentWeek.setHours(23, 59, 59, 999);

  const startOfLastWeek = new Date(startOfCurrentWeek);
  startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);

  const endOfLastWeek = new Date(endOfCurrentWeek);
  endOfLastWeek.setDate(endOfCurrentWeek.getDate() - 7);

  const salesThisWeek = sales.filter(
    (sale) =>
      sale.createdAt >= startOfCurrentWeek && sale.createdAt <= endOfCurrentWeek
  );

  const salesLastWeek = sales.filter(
    (sale) =>
      sale.createdAt >= startOfLastWeek && sale.createdAt < startOfCurrentWeek
  );

  const totalSalesThisWeek = salesThisWeek.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const totalSalesLastWeek = salesLastWeek.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const dailySalesList = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const salesInDay = await prisma.sale.findMany({
      where: {
        bakeryId,
        createdAt: {
          gte: date,
          lte: endOfDay,
        },
      },
    });

    const totalDailySales = salesInDay.reduce(
      (sum, sale) => sum + sale.total,
      0
    );

    dailySalesList.unshift({
      date: date.toISOString().split("T")[0],
      total: totalDailySales,
    });
  }

  return {
    totalDailySales: dailySales.reduce((sum, sale) => sum + sale.total, 0),
    totalSalesThisMonth,
    averageDailySales,
    salesGrowth: {
      current: totalSalesThisWeek,
      previous: totalSalesLastWeek,
    },
    dailySalesList,
  };

};
