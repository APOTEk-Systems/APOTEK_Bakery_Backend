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

export default router;