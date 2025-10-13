import { Router } from 'express';
import * as saleController from './sale.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['view:sales']), saleController.getSales);
router.post('/', authMiddleware, authorize(['create:sales']), saleController.createNewSale);
router.get('/summary', authMiddleware, authorize(['view:sales']), saleController.getSalesSummary);
router.get('/:id', authMiddleware, authorize(['view:sales']), saleController.getSaleById);
router.put('/:id', authMiddleware, authorize(['update:sales']), saleController.updateSale);
router.patch('/:id/pay', authMiddleware, authorize(['update:payment']), saleController.paySale);
router.delete('/:id', authMiddleware, authorize(['delete:sales']), saleController.deleteSale);


export default router;