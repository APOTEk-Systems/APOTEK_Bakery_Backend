import { Router } from 'express';
import * as reportingController from './reporting.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/sales', authMiddleware, authorize(['view:reports']), reportingController.getSalesReport);
router.get('/inventory', authMiddleware, authorize(['view:reports']), reportingController.getInventoryReport);
router.get('/customers', authMiddleware, authorize(['view:reports']), reportingController.getCustomerReport);
router.get('/financial', authMiddleware, authorize(['view:reports']), reportingController.getFinancialReport);
router.get('/production', authMiddleware, authorize(['view:reports']), reportingController.getProductionReport);
router.get('/audit', authMiddleware, authorize(['view:audit']), reportingController.getAuditReport);
router.get('/expense-breakdown', authMiddleware, authorize(['view:reports']), reportingController.getExpenseBreakdownReport);
router.get('/outstanding-payments', authMiddleware, authorize(['view:reports']), reportingController.getOutstandingPaymentsReport);
router.get('/ingredient-usage', authMiddleware, authorize(['view:reports']), reportingController.getIngredientUsageReport);
router.get('/finished-goods-summary', authMiddleware, authorize(['view:reports']), reportingController.getFinishedGoodsSummary);
router.get('/stock-adjustments', authMiddleware, authorize(['view:reports']), reportingController.getStockAdjustmentReport);
router.get('/ingredient-purchase-trend', authMiddleware, authorize(['view:reports']), reportingController.getIngredientPurchaseTrend);
router.get('/purchases-by-supplier', authMiddleware, authorize(['view:reports']), reportingController.getPurchasesBySupplierReport);
router.get('/purchases', authMiddleware, authorize(['view:reports']), reportingController.getPurchasesReport);

export default router;