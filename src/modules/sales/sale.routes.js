import { Router } from 'express';
import * as saleController from './sale.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['view:sales']), saleController.getSales);
router.post('/', authMiddleware, authorize(['create:sales']), saleController.createNewSale);
router.get('/summary', authMiddleware, authorize(['view:sales']), saleController.getSalesSummary);
router.get('/payments', authMiddleware, authorize(['view:sales']), saleController.getAllCreditPayments);
router.get('/:id', saleController.getSaleById);
router.put('/:id', authMiddleware, authorize(['update:sales']), saleController.updateSale);
router.delete('/:id', authMiddleware, authorize(['delete:sales']), saleController.deleteSale);

// Credit Payments
router.post('/:id/payments', authMiddleware, authorize(['create:sales']), saleController.createCreditPayment);
router.get('/:id/payments', authMiddleware, authorize(['view:sales']), saleController.getPaymentsForSale);
router.get('/payments', authMiddleware, authorize(['view:sales']), saleController.getAllCreditPayments);

export default router;