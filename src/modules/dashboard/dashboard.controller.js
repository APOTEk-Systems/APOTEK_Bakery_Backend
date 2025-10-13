import * as dashboardService from './dashboard.service.js';

export const getSalesDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getSalesDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getPurchasesDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getPurchasesDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getInventoryDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getInventoryDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getAccountingDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getAccountingDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getCustomersDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getCustomersDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};
