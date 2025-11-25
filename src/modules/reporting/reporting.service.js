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
 // const totalValue = params.includeValue ? inventoryItems.reduce((sum, item) => sum + (item.currentQuantity * item.cost), 0) : 0;

  return {
    inventoryItems,
    lowQuantity: lowQuantity.map(item => ({ id: item.id, name: item.name, currentQuantity: item.currentQuantity, minLevel: item.minLevel })),
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

  return customers.map((customer) => {
    const totalSales = customer.sales.length;
    const totalSpent = customer.sales.reduce((sum, sale) => sum + sale.total, 0);
    const avgSpending = totalSales > 0 ? totalSpent / totalSales : 0;

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      // keep other customer fields if needed
      totalSales,
      totalSpent,
      avgSpending,
    };
  });
};


/**
 * Calculates Gross Profit.
 * @param {object} params - Parameters for the calculation (e.g., totalSales, costOfGoodsSold).
 * @returns {object} An object containing the calculation parameters and the gross profit result.
 * @memberof ReportingService
 */
export const calculateGrossProfit = (params) => {
  const { totalSales, costOfGoodsSold } = params;
  const grossProfit = totalSales - costOfGoodsSold;
  return {
    parameters: { totalSales, costOfGoodsSold },
    result: grossProfit,
  };
};

/**
 * Calculates Net Profit.
 * @param {object} params - Parameters for the calculation (e.g., grossProfit, operatingExpenses).
 * @returns {object} An object containing the calculation parameters and the net profit result.
 * @memberof ReportingService
 */
export const calculateNetProfit = (params) => {
  const { grossProfit, operatingExpenses } = params;
  const netProfit = grossProfit - operatingExpenses;
  return {
    parameters: { grossProfit, operatingExpenses },
    result: netProfit,
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

  // 1. Total Sales (Revenue)
  const totalSales =
    (
      await prisma.sale.aggregate({
        where: dateFilter,
        _sum: { total: true },
      })
    )._sum.total || 0;

  // 2. Operating Expenses (not including inventory purchases)
  const operatingExpenses =
    (
      await prisma.expense.aggregate({
        where: { createdAt: dateFilter.createdAt },
        _sum: { amount: true },
      })
    )._sum.amount || 0;

  // 3. Inventory Purchases = COGS
  const purchaseItems = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: {
        ...dateFilter,
      },
      inventoryItem: {
        OR: [{ type: "raw_material" }, { type: "supplies" }],
      },
    },
    include: { inventoryItem: true },
  });

  const costOfGoodsSold = purchaseItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 4. Gross Profit = Sales – COGS
  const { parameters: grossProfitParams, result: grossProfit } = calculateGrossProfit({ totalSales, costOfGoodsSold });

  // 5. Net Profit = Gross Profit – Operating Expenses
  const { parameters: netProfitParams, result: netProfit } = calculateNetProfit({ grossProfit, operatingExpenses });

  return {
    revenue: totalSales,
    cogs: costOfGoodsSold,
    operatingExpenses,
    grossProfit: {
      parameters: grossProfitParams,
      result: grossProfit,
    },
    netProfit: {
      parameters: netProfitParams,
      result: netProfit,
    },
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
    include: {
      product: {
        include: {
          productRecipes: {
            include: {
              inventoryItem: true, // Include the inventory item details
            },
          },
        },
      },
      producedBy: true,
    },
  });

  const totalProduced = productionRuns.reduce((sum, run) => sum + run.quantityProduced, 0);
  const totalCost = productionRuns.reduce((sum, run) => sum + run.cost, 0);

  const production = productionRuns.map((run) => {
    const ingredients = run.product.productRecipes
      .map((recipe) => recipe.inventoryItem.name)
      .join(', ');

    return {
      Date: run.createdAt.toISOString().split('T')[0],
      'Item Name': run.product.name,
      Quantity: run.quantityProduced,
      'Ingredients Used': ingredients,
      Cost: run.cost,
      'Produced By': run.producedBy.name,
    };
  });

  return {
    totalProduced,
    totalCost,
    production,
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

export const generatePurchasesBySupplierReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    where: dateFilter,
    include: { supplier: true },
  });

  const bySupplier = purchaseOrders.reduce((acc, po) => {
    const supplierName = po.supplier.name;
    if (!acc[supplierName]) {
      acc[supplierName] = { totalPurchases: 0 };
    }
    acc[supplierName].totalPurchases += po.totalCost;
    return acc;
  }, {});

  return {
    bySupplier,
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

  return {
    purchaseOrders,
    totalPurchases,
  };
};
/**
 * Generates an ingredient purchase trend report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the ingredient purchase trend data.
 * @memberof ReportingService
 */
export const generateIngredientPurchaseTrend = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const ingredientPurchases = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: {
        ...dateFilter,
      },
    },
    include: {
      inventoryItem: true,
      purchaseOrder: true, // to get the createdAt date
    },
  });

  return ingredientPurchases.map((purchase) => ({
    item: purchase.inventoryItem.name,
    quantity: purchase.quantity, // total cost for that item
    date: purchase.purchaseOrder.createdAt.toISOString().split("T")[0],
  }));
};

/**
 * Generates a stock adjustment report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the stock adjustment report data.
 * @memberof ReportingService
 */
export const generateStockAdjustmentReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const stockAdjustments = await prisma.inventoryAdjustment.findMany({
    where: dateFilter,
    include: { inventoryItem: true, user: true },
  });

}
/**
 * Generates a finished goods summary report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the finished goods summary data.
 * @memberof ReportingService
 */
export const generateFinishedGoodsSummary = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  // Get productions
  const productionRuns = await prisma.productionRun.findMany({
    where: dateFilter,
    include: { product: true },
  });

  // Get sales in the same date range
  const sales = await prisma.sale.findMany({
    where: dateFilter,
    include: { items: true },
  });

  // Flatten sales items with productId
  const soldQuantities = sales.reduce((acc, sale) => {
    for (const item of sale.items) {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
    }
    return acc;
  }, {} );

  // Build flat array
  return productionRuns.map((run) => {
    const sold = soldQuantities[run.productId] || 0;
    return {
      item: run.product.name,
      produced: run.quantityProduced,
      sold,
      remaining: run.quantityProduced - sold,
      date: run.createdAt.toISOString().split("T")[0],
    };
  });
};


/**
 * Generates an ingredient usage report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the ingredient usage report data.
 * @memberof ReportingService
 */
export const generateIngredientUsageReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const ingredientUsages = await prisma.productionIngredientDeduction.findMany({
    where: {
      productionRun: {
        ...dateFilter,
      },
    },
    include: { 
      inventoryItem: true,
      productionRun: true,
    },
  });

  return ingredientUsages.map((usage) => ({
    item: usage.inventoryItem.name,
    amount: usage.amountDeducted,
    unit : usage.inventoryItem.unit,
    date: usage.productionRun.createdAt.toISOString().split("T")[0], // just YYYY-MM-DD
  }));
};

/**
 * Generates an outstanding payments report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the outstanding payments report data.
 * @memberof ReportingService
 */
export const generateOutstandingPaymentsReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  const outstandingPurchaseOrders = await prisma.purchaseOrder.findMany({
    where: {
      isPaid: false,
      ...dateFilter,
    },
    include: { supplier: true },
  });

  const outstandingSales = await prisma.sale.findMany({
    where: {
      isPaid: false,
      ...dateFilter,
    },
    include: { customer: true },
  });
}

/**
 * Generates an expense breakdown report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the expense breakdown report data.
 * @memberof ReportingService
 */
export const generateExpenseBreakdownReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  // 1. Normal expenses
  const expenses = await prisma.expense.findMany({
    where: dateFilter,
    include:{expenseCategory:true}
  });

  const breakdown = expenses.reduce((acc, expense) => {
    const category = expense.expenseCategory.name || "Uncategorized";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});

  let totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // 2. Inventory Purchases (raw_material + supplies)
  const purchaseItems = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: {
        ...dateFilter,
      },
      inventoryItem: {
        OR: [{ type: "raw_material" }, { type: "supplies" }],
      },
    },
    include: { inventoryItem: true },
  });

  const inventoryBreakdown = purchaseItems.reduce(
    (acc, item) => {
      const category =
        item.inventoryItem.type === "raw_material"
          ? "Raw Material Purchases"
          : "Supplies Purchases";

      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.price * item.quantity;
      return acc;
    },
    {}
  );

  // merge inventory breakdown into overall breakdown
  for (const [category, amount] of Object.entries(inventoryBreakdown)) {
    breakdown[category] = (breakdown[category] || 0) + amount;
    totalExpenses += amount;
  }

  return {
    breakdown,
    totalExpenses,
  };
};

/**
 * Generates a production summary report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the production summary report data.
 * @memberof ReportingService
 */
export const generateProductionSummaryReport = async ({ date, endDate, startDate }) => {
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
      lt: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }

  const productionRuns = await prisma.productionRun.findMany({
    where,
    include: {
      product: true,
    },
  });

  const productionSummary = productionRuns.reduce((acc, run) => {
    const productName = run.product.name;
    if (!acc[productName]) {
      acc[productName] = {
        totalQuantity: 0,
        unit: run.product.unit,
      };
    }
    acc[productName].totalQuantity += run.quantityProduced;
    return acc;
  }, {});

  return {
    productionSummary,
  };
};

/**
 * Generates an ingredient summary report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the ingredient summary report data.
 * @memberof ReportingService
 */
export const generateIngredientSummaryReport = async ({ date, endDate, startDate }) => {
  const where = {};

  if (date) {
    where.productionRun = {
      createdAt: {
        gte: new Date(date),
        lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
    };
  }

  if (startDate && endDate) {
    where.productionRun = {
      createdAt: {
        gte: new Date(startDate),
        lt: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      },
    };
  }

  const ingredientUsages = await prisma.productionIngredientDeduction.findMany({
    where,
    include: {
      inventoryItem: true,
    },
  });

  const ingredientSummary = ingredientUsages.reduce((acc, usage) => {
    const ingredientName = usage.inventoryItem.name;
    if (!acc[ingredientName]) {
      acc[ingredientName] = {
        totalQuantity: 0,
        unit: usage.inventoryItem.unit,
      };
    }
    acc[ingredientName].totalQuantity += usage.amountDeducted;
    return acc;
  }, {});

  return {
    ingredientSummary,
  };
};

/**
 * Generates a sales summary report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the sales summary report data.
 * @memberof ReportingService
 */
export const generateSalesSummaryReport = async ({ date, endDate, startDate }) => {
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
      lt: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }

  const sales = await prisma.sale.findMany({
    where,
  });

  const salesSummary = sales.reduce((acc, sale) => {
    const date = sale.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        totalSales: 0,
      };
    }
    acc[date].totalSales += sale.total;
    return acc;
  }, {});

  return {
    salesSummary,
  };
};


