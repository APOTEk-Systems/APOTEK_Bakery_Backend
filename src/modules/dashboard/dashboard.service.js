import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardData = async (role) => {
  if (role === 'admin') {
    return getAdminDashboardData();
  }
  return getCashierDashboardData();
};

async function getAdminDashboardData() {
  const cashierDashboardData = await getCashierDashboardData();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay());

  const dailySpend = await prisma.purchaseOrder.aggregate({
    _sum: {
      totalCost: true,
    },
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const weeklySpend = await prisma.purchaseOrder.aggregate({
    _sum: {
      totalCost: true,
    },
    where: {
      createdAt: {
        gte: firstDayOfWeek,
      },
    },
  });

  const recentPurchases = await prisma.purchaseOrder.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const pendingPayments = await prisma.purchaseOrder.aggregate({
    _sum: {
      totalCost: true,
    },
    where: {
      status: 'approved',
    },
  });

  const lowStockAlerts = await prisma.inventoryItem.findMany({
    where: {
      currentQuantity: {
        lt: 10, // prisma.inventoryItem.fields.minLevel is not supported
      },
    },
  });

  const recentStockUpdates = await prisma.inventoryAdjustment.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const ingredientOverview = await prisma.inventoryItem.findMany({
    where: {
      type: 'raw_material',
    },
  });

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthlyIncome = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: firstDayOfMonth,
      },
    },
  });

  const weeklyIncome = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: firstDayOfWeek,
      },
    },
  });

  const monthlyExpenses = await prisma.expense.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: firstDayOfMonth,
      },
    },
  });

  const weeklyExpenses = await prisma.expense.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: firstDayOfWeek,
      },
    },
  });

  const allTimeUnpaidSales = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      isCredit: true,
      status: "unpaid",
    },
  });

  const monthlyProfitLoss = await Promise.all(
    [...Array(6)].map(async (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const income = await prisma.sale.aggregate({
        _sum: {
          total: true,
        },
        where: {
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
        },
      });

      const expenses = await prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: firstDay,
            lte: lastDay,
          },
        },
      });

      return {
        month: firstDay.toLocaleString('default', { month: 'long' }),
        profit: (income._sum.total || 0) - (expenses._sum.amount || 0),
      };
    })
  );

  const totalCustomers = await prisma.customer.count();
  const newCustomersThisWeek = await prisma.customer.count({
    where: {
      createdAt: {
        gte: firstDayOfWeek,
      },
    },
  });

  return {
    ...cashierDashboardData,
    purchaseSummary: {
      dailySpend: dailySpend._sum.totalCost || 0,
      weeklySpend: weeklySpend._sum.totalCost || 0,
      recentPurchases,
      pendingPayments: pendingPayments._sum.totalCost || 0,
    },
    inventorySummary: {
      lowStockAlerts,
      recentStockUpdates,
      ingredientOverview,
    },
    accountingSummary: {
      incomeVsExpenses: {
        monthlyIncome: monthlyIncome._sum.total || 0,
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        weeklyIncome: weeklyIncome._sum.total || 0,
        weeklyExpenses: weeklyExpenses._sum.amount || 0,
      },
      allTimeUnpaidSales: allTimeUnpaidSales._sum.total || 0,
      monthlyProfitLoss: monthlyProfitLoss.reverse(),
    },
    customerSummary: {
      totalCustomers,
      newCustomersThisWeek,
    },
  };
};

async function getCashierDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay());

  const dailySales = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  const weeklySales = await prisma.sale.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: firstDayOfWeek,
      },
    },
  });

  const topSellingProducts = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 5,
  });

  // get product names
  const productIds = topSellingProducts.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const topSellingProductsWithNames = topSellingProducts.map((p) => {
    const product = products.find((prod) => prod.id === p.productId);
    return {
      ...p,
      productName: product ? product.name : 'Unknown',
    };
  });

  return {
    salesSummary: {
      dailySales: dailySales._sum.total || 0,
      weeklySales: weeklySales._sum.total || 0,
      topSellingProducts: topSellingProductsWithNames,
    },
  };
};


