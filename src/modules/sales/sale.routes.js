import { Router } from 'express';
import * as saleController from './sale.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['read:sales']), saleController.getSales);
router.post('/', authMiddleware, authorize(['write:sales']), saleController.createNewSale);
router.get('/:id', authMiddleware, authorize(['read:sales']), saleController.getSaleById);
router.put('/:id', authMiddleware, authorize(['write:sales']), saleController.updateSale);
router.patch('/:id/pay', authMiddleware, authorize(['write:sales']), saleController.paySale);
router.delete('/:id', authMiddleware, authorize(['delete:sales']), saleController.deleteSale);

export default router;