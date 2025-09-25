import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const applyDateRangeFilter = (params) => {
  const { startDate, endDate } = params;
  let dateFilter = {};

  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) {
      dateFilter.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
     dateFilter.createdAt.lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }
  }

  return dateFilter;
};

/**
 * @namespace ReportingService
 * @description Handles all reporting-related business logic.
 */

/**
 * Generates a sales report.
 * @param {object} params - Parameters for the report (e.g., period, startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the sales report data.
 * @memberof ReportingService
 */
export const generateSalesReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const sales = await prisma.sale.findMany({
    where: dateFilter,
    include: { customer: true },
  });

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

  const creditCustomers = await prisma.customer.findMany({ where: { isCredit: true } });
  const creditOutstanding = creditCustomers.reduce((sum, customer) => sum + (customer.currentCredit || 0), 0);

  return {
    sales,
    totalSales,
    creditOutstanding,
  };
};

/**
 * Generates an inventory report.
 * @param {object} params - Parameters for the report (e.g., includeValue).
 * @returns {Promise<object>} A promise that resolves to the inventory report data.
 * @memberof ReportingService
 */
export const generateInventoryReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const inventoryItems = await prisma.inventoryItem.findMany({ where: dateFilter });

  const lowQuantity = inventoryItems.filter(item => item.currentQuantity <= item.minLevel);
  const totalValue = params.includeValue ? inventoryItems.reduce((sum, item) => sum + (item.currentQuantity * item.cost), 0) : 0;

  return {
    totalItems: inventoryItems.length,
    lowQuantity: lowQuantity.map(item => ({ id: item.id, name: item.name, currentQuantity: item.currentQuantity, minLevel: item.minLevel })),
    totalValue,
    byCategory: {},
  };
};

/**
 * Generates a customer report.
 * @param {object} params - Parameters for the report (e.g., top).
 * @returns {Promise<object>} A promise that resolves to the customer report data.
 * @memberof ReportingService
 */
export const generateCustomerReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const customers = await prisma.customer.findMany({
    where: dateFilter,
    include: { sales: true },
  });

  // Basic implementation: total loyalty points
  const loyaltySummary = customers.reduce((sum, customer) => sum + (customer.loyaltyPoints || 0), 0);

  return {
    topCustomers: [],
    creditRisks: [],
    loyaltySummary: { totalPoints: loyaltySummary },
  };
};

/**
 * Generates a financial report.
 * @param {object} params - Parameters for the report (e.g., period).
 * @returns {Promise<object>} A promise that resolves to the financial report data.
 * @memberof ReportingService
 */
export const generateFinancialReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  // This would typically aggregate data from Sales, Expenses, etc.
  const totalSales = (await prisma.sale.aggregate({ where: dateFilter, _sum: { total: true } }))._sum.total || 0;
  const totalExpenses = (await prisma.expense.aggregate({ where: { createdAt: dateFilter.createdAt }, _sum: { amount: true } }))._sum.amount || 0;

  return {
    revenue: totalSales,
    expenses: totalExpenses,
    netProfit: totalSales - totalExpenses,
    cashFlow: 0, // Placeholder
  };
};

/**
 * Generates a production report.
 * @param {object} params - Parameters for the report (e.g., period).
 * @returns {Promise<object>} A promise that resolves to the production report data.
 * @memberof ReportingService
 */
export const generateProductionReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const productionRuns = await prisma.productionRun.findMany({
    where: dateFilter,
    include: { product: true },
  });

  const totalProduced = productionRuns.reduce((sum, run) => sum + run.quantityProduced, 0);
  const totalCost = productionRuns.reduce((sum, run) => sum + run.cost, 0);

 const production = productionRuns.map((p) => ({
  ...p,
  product: p.product.name, // flatten product to just the name
}));

  return {
    totalProduced,
    production,
    totalCost,
  };
};

/**
 * Generates an audit log report.
 * @param {object} params - Parameters for the report (e.g., userId, fromDate, action).
 * @returns {Promise<object>} A promise that resolves to the audit log report data.
 * @memberof ReportingService
 */
export const generateAuditReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  if (dateFilter.createdAt) {
    dateFilter.timestamp = dateFilter.createdAt;
    delete dateFilter.createdAt;
  }

  const auditLogs = await prisma.auditLog.findMany({ where: dateFilter });

  return {
    data: auditLogs,
    total: auditLogs.length,
  };
};

/**
 * Generates a purchases report.
 * @param {object} params - Parameters for the report (e.g., period, startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the purchases report data.
 * @memberof ReportingService
 */
export const generatePurchasesReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: dateFilter,
    include: {supplier: true },
  });

  const totalPurchases = purchaseOrders.reduce((sum, po) => sum + po.totalCost, 0);

  // const bySupplier = purchaseOrders.reduce((acc, po) => {
  //   const supplierName = po.supplier.name;
  //   if (!acc[supplierName]) {
  //     acc[supplierName] = { totalPurchases: 0 };
  //   }
  //   acc[supplierName].totalPurchases += po.totalCost;
  //   return acc;
  // }, {});


  return {
    purchaseOrders,
    totalPurchases,
    //bySupplier,
   // byItem,
  };
};
