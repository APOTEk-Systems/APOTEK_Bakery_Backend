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

  // Get all sales within date range
  const sales = await prisma.sale.findMany({
    where: dateFilter,
    select: { total: true, createdAt: true },
  });

  // Get all purchase items within date range
  const purchaseItems = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: {
        ...dateFilter,
      },
      inventoryItem: {
        OR: [{ type: "raw_material" }, { type: "supplies" }],
      },
    },
    include: { purchaseOrder: { select: { createdAt: true } } },
  });

  // Group sales by date
  const salesByDate = sales.reduce((acc, sale) => {
    const date = sale.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += sale.total;
    return acc;
  }, {});

  // Group purchases by date
  const purchasesByDate = purchaseItems.reduce((acc, item) => {
    const date = item.purchaseOrder.createdAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += item.price * item.quantity;
    return acc;
  }, {});

  // Get all unique dates from both sales and purchases
  const allDates = new Set([...Object.keys(salesByDate), ...Object.keys(purchasesByDate)]);

  // Create daily aggregated data
  const dailyData = Array.from(allDates).sort().map(date => {
    const totalSales = salesByDate[date] || 0;
    const totalPurchases = purchasesByDate[date] || 0;
    const grossProfit = totalSales - totalPurchases;

    return {
      date,
      totalSales,
      totalPurchases,
      grossProfit,
    };
  });

  // Calculate totals for backward compatibility
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPurchases = purchaseItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grossProfit = totalSales - totalPurchases;

  // Operating Expenses (not including inventory purchases)
  const operatingExpenses =
    (
      await prisma.expense.aggregate({
        where: { createdAt: dateFilter.createdAt },
        _sum: { amount: true },
      })
    )._sum.amount || 0;

  // Net Profit = Gross Profit – Operating Expenses
  const netProfit = grossProfit - operatingExpenses;

  return {
    dailyData,
    summary: {
      revenue: totalSales,
      cogs: totalPurchases,
      operatingExpenses,
      grossProfit,
      netProfit,
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
    orderBy: { createdAt: 'desc' },
  });

  const productionSummary = productionRuns.reduce((acc, run) => {
    const date = run.createdAt.toISOString().split('T')[0];
    const productName = run.product.name;
    const key = `${date}-${productName}`; // Create a unique key for date and product

    if (!acc[key]) {
      acc[key] = {
        date: date,
        product: productName,
        quantity: 0,
      };
    }
    acc[key].quantity += run.quantityProduced;
    return acc;
  }, {});

  return Object.values(productionSummary);
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
      productionRun: true,
    },
    orderBy: { productionRun: { createdAt: 'desc' } },
  });

 const ingredientSummary = ingredientUsages.reduce((acc, usage) => {
  const date = usage.productionRun.createdAt.toISOString().split('T')[0];
  const ingredientName = usage.inventoryItem.name;
  const key = `${date}-${ingredientName}`;
  const unit = usage.inventoryItem.unit;

  if (!acc[key]) {
    acc[key] = {
      date: date,
      ingredient: ingredientName,
      quantity: 0,
      unit: unit, // keep unit if needed
    };
  }

  // apply conversion
  let qty = usage.amountDeducted;

  if (unit === "kg" || unit === "l") {
    qty = qty / 1000; // convert grams → kg or ml → liters
  }

  acc[key].quantity += qty;

  return acc;
}, {});


  return Object.values(ingredientSummary);
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
    orderBy: { createdAt: 'desc' },
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

  return Object.entries(salesSummary).map(([date, data]) => ({
    date,
    total: data.totalSales,
  }));
};

/**
 * Generates a sales returns report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<Array>} A promise that resolves to the sales returns data.
 * @memberof ReportingService
 */
export const generateSalesReturnsReport = async ({ date, endDate, startDate }) => {
  const where = {
    status: 'APPROVED',
  };

  if (date) {
    where.updatedAt = {
      gte: new Date(date),
      lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    };
  }

  if (startDate && endDate) {
    where.updatedAt = {
      gte: new Date(startDate),
      lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
    };
  }

  // Get approved sales adjustments (these represent returns)
  const salesAdjustments = await prisma.salesAdjustment.findMany({
    where,
    include: {
      sale: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      approvedBy: true,
      requestedBy: true,
    },
    orderBy:{
      createdAt: 'desc'
    }
  });

  // Transform the data into the required format
  return salesAdjustments.flatMap((adjustment) => {
    return adjustment.items.map((adjustmentItem) => {
      // Find the corresponding sale item
      const saleItem = adjustment.sale.items.find(
        (item) => item.productId === adjustmentItem.productId
      );

      // Calculate the sold quantity (original sale quantity)
      const soldQty = saleItem ? saleItem.quantity : 0;
      
      // Get the returned quantity
      const returnedQty = adjustmentItem.quantity;
      
      // Calculate returned amount (unit price * returned quantity)
      const price = adjustmentItem.price ?? (saleItem ? saleItem.price : 0);
      const returnedAmount = price * returnedQty;

      return {
        productName: adjustmentItem.product.name,
        saleDate: adjustment.sale.createdAt.toISOString().split('T')[0],
        returnedDate: adjustment.updatedAt.toISOString().split('T')[0],
        soldQty: soldQty + returnedQty, // original sold qty
        returnedQty: returnedQty,
        returnedAmount: returnedAmount,
        // Additional fields that might be useful
        saleId: adjustment.saleId,
        adjustmentId: adjustment.id,
        reason: adjustment.reason,
        approvedBy: adjustment.approvedBy?.name,
        requestedBy: adjustment.requestedBy?.name,
      };
    });
  }).sort((a, b) => new Date(b.returnedDate) - new Date(a.returnedDate)); // Sort by return date descending
};

/**
 * Generates a credit sales summary report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the credit sales summary report data.
 * @memberof ReportingService
 */
export const generateCashSalesSummaryReport = async ({ date, endDate, startDate }) => {
  const where = {
    isCredit: false,
  };

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
    orderBy: { createdAt: 'desc' },
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

  return Object.entries(salesSummary).map(([date, data]) => ({
    date,
    total: data.totalSales,
  }));
};

/**
 * Generates a credit sales summary report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the credit sales summary report data.
 * @memberof ReportingService
 */
export const generateCreditSalesSummaryReport = async ({ date, endDate, startDate }) => {
  const where = {
    isCredit: true,
  };

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
    orderBy: { createdAt: 'desc' },
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

  return Object.entries(salesSummary).map(([date, data]) => ({
    date,
    total: data.totalSales,
  }));
};

/**
 * Generates a net profit report.
 * @param {object} params - Parameters for the report (e.g., startDate, endDate).
 * @returns {Promise<object>} A promise that resolves to the net profit report data.
 * @memberof ReportingService
 */
export const generateNetProfitReport = async (params) => {
  const dateFilter = applyDateRangeFilter(params);

  // Get total sales
  const sales = await prisma.sale.findMany({
    where: dateFilter,
    select: { total: true },
  });
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

  // Get total purchases (raw materials and supplies)
  const purchaseItems = await prisma.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: {
        ...dateFilter,
      },
      inventoryItem: {
        OR: [{ type: "raw_material" }, { type: "supplies" }],
      },
    },
    select: { price: true, quantity: true },
  });
  const totalPurchases = purchaseItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Get total expenses
  const expenses = await prisma.expense.aggregate({
    where: { createdAt: dateFilter.createdAt },
    _sum: { amount: true },
  });
  const totalExpenses = expenses._sum.amount || 0;

  // Calculate net profit
  const netProfit = totalSales - totalPurchases - totalExpenses;

  return {
    totalSales,
    totalPurchases,
    totalExpenses,
    netProfit,
  };
};


