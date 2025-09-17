import * as dashboardService from './dashboard.service.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const { role } = req.user;
    const data = await dashboardService.getDashboardData(role);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
