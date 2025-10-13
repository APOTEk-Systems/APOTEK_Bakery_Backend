import express from 'express';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';
import * as dashboardController from './dashboard.controller.js';

const router = express.Router();

router.get('/sales', authMiddleware, authorize(['view:salesDashboard']), dashboardController.getSalesDashboardData);
router.get('/purchases', authMiddleware, authorize(['view:purchasesDashboard']), dashboardController.getPurchasesDashboardData);
router.get('/inventory', authMiddleware, authorize(['view:inventoryDashboard']), dashboardController.getInventoryDashboardData);
router.get('/accounting', authMiddleware, authorize(['view:accountingDashboard']), dashboardController.getAccountingDashboardData);
router.get('/customers', authMiddleware, authorize(['view:customersDashboard']), dashboardController.getCustomersDashboardData);

export default router;
