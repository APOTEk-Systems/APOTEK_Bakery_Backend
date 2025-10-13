import { getSalesSummary } from '../sales/sale.service.js';
import { getPurchaseSummary } from '../purchases/purchase.service.js';
import { getInventorySummary } from '../inventory/inventory.service.js';
import { getAccountingSummary } from '../accounting/accounting.service.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getSalesDashboardData = async () => {
  return await getSalesSummary();
};

export const getPurchasesDashboardData = async () => {
  return await getPurchaseSummary();
};

export const getInventoryDashboardData = async () => {
  return await getInventorySummary();
};

export const getAccountingDashboardData = async () => {
  return await getAccountingSummary();
};

export const getCustomersDashboardData = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay());
  const totalCustomers = await prisma.customer.count();
  const newCustomersThisWeek = await prisma.customer.count({
    where: {
      createdAt: {
        gte: firstDayOfWeek,
      },
    },
  });
  return {
    totalCustomers,
    newCustomersThisWeek,
  };
};
