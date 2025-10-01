
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @namespace AccountingService
 * @description Handles all accounting-related business logic.
 */

/**
 * Retrieves all expenses from the database, with optional filtering.
 * @param {object} filters - Filters for expenses (e.g., category, dateFrom, dateTo).
 * @returns {Promise<Array>} A promise that resolves to an array of expenses.
 * @memberof AccountingService
 */
export const getAllExpenses = async (filters) => {
  const where = {};
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.dateFrom && filters.dateTo) {
    where.date = {
      gte: new Date(filters.dateFrom),
      lte: new Date(filters.dateTo),
    };
  } else if (filters.dateFrom) {
    where.date = { gte: new Date(filters.dateFrom) };
  } else if (filters.dateTo) {
    where.date = { lte: new Date(filters.dateTo) };
  }
  return await prisma.expense.findMany({ where });
};

/**
 * Retrieves a single expense by its ID.
 * @param {string} id - The ID of the expense.
 * @returns {Promise<object>} A promise that resolves to the expense object.
 * @memberof AccountingService
 */
export const getExpenseById = async (id) => {
  return await prisma.expense.findUnique({ where: { id: parseInt(id) } });
};

/**
 * Creates a new expense.
 * @param {object} expenseData - The data for the new expense.
 * @returns {Promise<object>} A promise that resolves to the newly created expense.
 * @memberof AccountingService
 */
export const createExpense = async (expenseData) => {
  if (!expenseData.notes) {
    const category = await prisma.expenseCategory.findUnique({
      where: { id: expenseData.expenseCategoryId },
    });
    const date = new Date(expenseData.date).toLocaleDateString('en-GB');
    expenseData.notes = `${category.name} expense for ${date}`;
  }
  return await prisma.expense.create({ data: expenseData });
};

/**
 * Updates an existing expense.
 * @param {string} id - The ID of the expense to update.
 * @param {object} updateData - The data to update the expense with.
 * @returns {Promise<object>} A promise that resolves to the updated expense.
 * @memberof AccountingService
 */
export const updateExpense = async (id, updateData) => {
  return await prisma.expense.update({ where: { id: parseInt(id) }, data: updateData });
};

/**
 * Updates the status of an expense.
 * @param {string} id - The ID of the expense.
 * @param {string} status - The new status (e.g., 'approved', 'paid').
 * @param {string} approvedBy - The ID of the user who approved the expense.
 * @returns {Promise<object>} A promise that resolves to the updated expense.
 * @memberof AccountingService
 */
export const updateExpenseStatus = async (id, status, approvedBy) => {
  return await prisma.expense.update({
    where: { id: parseInt(id) },
    data: { status, approvedBy },
  });
};

/**
 * Deletes an expense.
 * @param {string} id - The ID of the expense to delete.
 * @returns {Promise<object>} A promise that resolves when the expense is deleted.
 * @memberof AccountingService
 */
export const deleteExpense = async (id) => {
  return await prisma.expense.delete({ where: { id: parseInt(id) } });
};

/**
 * Creates a new expense category.
 * @param {object} expenseCategoryData - The data for the new expense category.
 * @returns {Promise<object>} A promise that resolves to the newly created expense category.
 * @memberof AccountingService
 */
export const addExpenseCategory = async (expenseCategoryData) => {
  return await prisma.expenseCategory.create({ data: expenseCategoryData });
};

/**
 * Retrieves all expense categories from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of expense categories.
 * @memberof AccountingService
 */
export const getExpenseCategories = async () => {
  return await prisma.expenseCategory.findMany();
};

/**
 * Retrieves a single expense category by its ID.
 * @param {string} id - The ID of the expense category.
 * @returns {Promise<object>} A promise that resolves to the expense category object.
 * @memberof AccountingService
 */
export const getExpenseCategoryById = async (id) => {
  return await prisma.expenseCategory.findUnique({ where: { id: parseInt(id) } });
};

/**
 * Updates an existing expense category.
 * @param {string} id - The ID of the expense category to update.
 * @param {object} updateData - The data to update the expense category with.
 * @returns {Promise<object>} A promise that resolves to the updated expense category.
 * @memberof AccountingService
 */
export const updateExpenseCategory = async (id, updateData) => {
  return await prisma.expenseCategory.update({ where: { id: parseInt(id) }, data: updateData });
};

/**
 * Deletes an expense category.
 * @param {string} id - The ID of the expense category to delete.
 * @returns {Promise<object>} A promise that resolves when the expense category is deleted.
 * @memberof AccountingService
 */
export const deleteExpenseCategory = async (id) => {
  return await prisma.expenseCategory.delete({ where: { id: parseInt(id) } });
};

/**
 * Generates a summary of expenses by category and total.
 * @param {object} filters - Filters for expenses (e.g., dateFrom, dateTo).
 * @returns {Promise<object>} A promise that resolves to the expense summary data.
 * @memberof AccountingService
 */
export const getExpensesSummary = async (filters) => {
  const dateWhere = {};
 if (filters.dateFrom && filters.dateTo) {
  dateWhere.createdAt = {
    gte: new Date(filters.dateFrom),
    lte: new Date(filters.dateTo),
  };
} else if (filters.dateFrom) {
  dateWhere.createdAt = { gte: new Date(filters.dateFrom) };
} else if (filters.dateTo) {
  dateWhere.createdAt = { lte: new Date(filters.dateTo) };
} else {
  // ✅ default: last 7 days
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  dateWhere.createdAt = {
    gte: weekAgo,
    lte: now,
  };
}

  // 1. Normal expenses
  const expenses = await prisma.expense.findMany({ where: dateWhere });

  // 2. Supplies + raw materials from purchase order items
  const inventoryExpenses = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: { createdAt: dateWhere.createdAt },
      inventoryItem: {
        OR: [
          { type: "raw_material" },
          { type: "supplies" },
        ],
      },
    },
    include: {
      inventoryItem: true,
      purchaseOrder: true,
    },
  });

  // normalize into a single list
  const allItems = [
    ...expenses.map((e) => ({ category: e.category, amount: e.amount })),
    ...inventoryExpenses.map((i) => ({
      category: i.inventoryItem.type === "raw_material" ? "Raw Materials" : "Supplies",
      amount: i.price * i.quantity,
    })),
  ];

  const summaryByCategory = allItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const totalExpenses = allItems.reduce((sum, item) => sum + item.amount, 0);

  return {
    summaryByCategory,
    totalExpenses,
  };
};



/**
 * Generates a comprehensive accounting report.
 * @param {object} filters - Filters for the report (e.g., dateFrom, dateTo).
 * @returns {Promise<object>} A promise that resolves to the accounting report data.
 * @memberof AccountingService
 */
export const getAccountingReport = async (filters) => {
  const dateWhere = {};
  if (filters.dateFrom && filters.dateTo) {
    dateWhere.createdAt = {
      gte: new Date(filters.dateFrom),
      lte: new Date(filters.dateTo),
    };
  } else if (filters.dateFrom) {
    dateWhere.createdAt = { gte: new Date(filters.dateFrom) };
  } else if (filters.dateTo) {
    dateWhere.createdAt = { lte: new Date(filters.dateTo) };
  }

  // Calculate total expenses for the period
  const expenses = await prisma.expense.findMany({ where: dateWhere });
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Aggregate expenses daily by category
  const dailyBreakdownMap = new Map();

  expenses.forEach(expense => {
    const date = expense.date.toISOString().split('T')[0]; // YYYY-MM-DD
    const key = `${date}-${expense.category}`;
    const currentTotal = dailyBreakdownMap.get(key) || 0;
    dailyBreakdownMap.set(key, currentTotal + expense.amount);
  });

  // Calculate total cost of raw material and supplies inventory for the period
  const rawMaterialItems = await prisma.inventoryItem.findMany({
    where: {
      type: 'raw_material',
      ...dateWhere,
    },
  });
  const totalRawMaterialCost = rawMaterialItems.reduce((sum, item) => sum + (item.cost * item.currentQuantity), 0);

  const suppliesItems = await prisma.inventoryItem.findMany({
    where: {
      type: 'supplies',
      ...dateWhere,
    },
  });
  const totalSuppliesCost = suppliesItems.reduce((sum, item) => sum + (item.cost * item.currentQuantity), 0);

  // Add raw materials and supplies to daily breakdown based on their creation date
  rawMaterialItems.forEach(item => {
    const date = item.createdAt.toISOString().split('T')[0];
    const key = `${date}-raw_materials`;
    const currentTotal = dailyBreakdownMap.get(key) || 0;
    dailyBreakdownMap.set(key, currentTotal + (item.cost * item.currentQuantity));
  });

  suppliesItems.forEach(item => {
    const date = item.createdAt.toISOString().split('T')[0];
    const key = `${date}-supplies`;
    const currentTotal = dailyBreakdownMap.get(key) || 0;
    dailyBreakdownMap.set(key, currentTotal + (item.cost * item.currentQuantity));
  });

  const dailyBreakdown = Array.from(dailyBreakdownMap).map(([key, total]) => {
    const [date, cat] = key.split('-');
    return { cat, total, date };
  }).sort((a, b) => a.date.localeCompare(b.date) || a.cat.localeCompare(b.cat));

  // For a full financial report, you'd also fetch income from sales, etc.
  return {
    income: 0, // Placeholder for actual income calculation
    totalExpenses,
    totalRawMaterialCost,
    totalSuppliesCost,
    dailyBreakdown,
    profit: 0, // Placeholder for actual profit calculation
    breakdown: {}, // Placeholder for more detailed breakdown
  };
};


export const getExpensesList = async (filters) => {
  const where = {};

  if (filters.startDate && filters.endDate) {
    where.date = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate),
    };
  } else if (filters.startDate) {
    where.date = {
      gte: new Date(filters.startDate),
    };
  } else if (filters.endDate) {
    where.date = {
      lte: new Date(filters.endDate),
    };
  }

  if (filters.categoryId) {
    where.expenseCategoryId = parseInt(filters.categoryId);
  }

  return await prisma.expense.findMany({
    where,
    include: {
      expenseCategory: true,
    },
  });
};


export const getAccountingSummary = async () => {
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // last day of previous month

  // --- 1. Operating Expenses ---
  const expensesCurrentMonth = await prisma.expense.findMany({
    where: { date: { gte: currentMonthStart } },
  });
  const totalOperatingExpensesCurrentMonth = expensesCurrentMonth.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const expensesLastMonth = await prisma.expense.findMany({
    where: { date: { gte: lastMonthStart, lte: lastMonthEnd } },
  });
  const totalOperatingExpensesLastMonth = expensesLastMonth.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  // --- 2. Inventory Purchases (COGS) ---
  const purchaseItemsCurrentMonth = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: { createdAt: { gte: currentMonthStart } },
      inventoryItem: { OR: [{ type: "raw_material" }, { type: "supplies" }] },
    },
    include: { inventoryItem: true },
  });
  const cogsCurrentMonth = purchaseItemsCurrentMonth.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const purchaseItemsLastMonth = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      inventoryItem: { OR: [{ type: "raw_material" }, { type: "supplies" }] },
    },
    include: { inventoryItem: true },
  });
  const cogsLastMonth = purchaseItemsLastMonth.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // --- 3. Revenue ---
  const salesCurrentMonth = await prisma.sale.aggregate({
    where: { createdAt: { gte: currentMonthStart } },
    _sum: { total: true },
  });
  const totalRevenueCurrentMonth = salesCurrentMonth._sum.total || 0;

  const salesLastMonth = await prisma.sale.aggregate({
    where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    _sum: { total: true },
  });
  const totalRevenueLastMonth = salesLastMonth._sum.total || 0;

  // --- 4. Profit Calculations ---
  const grossProfitCurrentMonth = totalRevenueCurrentMonth - cogsCurrentMonth;
  const netProfitCurrentMonth = grossProfitCurrentMonth - totalOperatingExpensesCurrentMonth;

  const grossProfitLastMonth = totalRevenueLastMonth - cogsLastMonth;
  const netProfitLastMonth = grossProfitLastMonth - totalOperatingExpensesLastMonth;

  return {
    currentMonth: {
      revenue: totalRevenueCurrentMonth,
      cogs: cogsCurrentMonth,
      operatingExpenses: totalOperatingExpensesCurrentMonth,
      grossProfit: grossProfitCurrentMonth,
      netProfit: netProfitCurrentMonth,
    },
    lastMonth: {
      revenue: totalRevenueLastMonth,
      cogs: cogsLastMonth,
      operatingExpenses: totalOperatingExpensesLastMonth,
      grossProfit: grossProfitLastMonth,
      netProfit: netProfitLastMonth,
    },
  };
};





