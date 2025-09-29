import { Router } from 'express';
import * as reportingController from './reporting.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/sales', authMiddleware, authorize(['read:reports']), reportingController.getSalesReport);
router.get('/inventory', authMiddleware, authorize(['read:reports']), reportingController.getInventoryReport);
router.get('/customers', authMiddleware, authorize(['read:reports']), reportingController.getCustomerReport);
router.get('/financial', authMiddleware, authorize(['read:reports']), reportingController.getFinancialReport);
router.get('/production', authMiddleware, authorize(['read:reports']), reportingController.getProductionReport);
router.get('/audit', authMiddleware, authorize(['read:reports']), reportingController.getAuditReport);
router.get('/expense-breakdown', authMiddleware, authorize(['read:reports']), reportingController.getExpenseBreakdownReport);
router.get('/outstanding-payments', authMiddleware, authorize(['read:reports']), reportingController.getOutstandingPaymentsReport);
router.get('/ingredient-usage', authMiddleware, authorize(['read:reports']), reportingController.getIngredientUsageReport);
router.get('/finished-goods-summary', authMiddleware, authorize(['read:reports']), reportingController.getFinishedGoodsSummary);
router.get('/stock-adjustments', authMiddleware, authorize(['read:reports']), reportingController.getStockAdjustmentReport);
router.get('/ingredient-purchase-trend', authMiddleware, authorize(['read:reports']), reportingController.getIngredientPurchaseTrend);
router.get('/purchases-by-supplier', authMiddleware, authorize(['read:reports']), reportingController.getPurchasesBySupplierReport);
router.get('/purchases', authMiddleware, authorize(['read:reports']), reportingController.getPurchasesReport);

export default router;