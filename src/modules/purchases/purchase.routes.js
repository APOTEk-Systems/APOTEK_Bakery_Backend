import { Router } from 'express';
import * as purchaseController from './purchase.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/orders', authMiddleware, authorize(['read:purchases']), purchaseController.getPurchaseOrders);
router.post('/orders', authMiddleware, authorize(['write:purchases']), purchaseController.createNewPurchaseOrder);
router.get('/orders/:id', authMiddleware, authorize(['read:purchases']), purchaseController.getPurchaseOrderById);
router.put('/orders/:id', authMiddleware, authorize(['write:purchases']), purchaseController.updatePurchaseOrder);
router.patch('/orders/:id/status', authMiddleware, authorize(['update:purchase-status']), purchaseController.updatePurchaseOrderStatus);
router.delete('/orders/:id', authMiddleware, authorize(['delete:purchases']), purchaseController.deletePurchaseOrder);
router.get('/receiving', authMiddleware, authorize(['read:purchases']), purchaseController.getGoodsReceipts);
router.post('/receiving', authMiddleware, authorize(['write:purchases']), purchaseController.createNewGoodsReceipt);
router.get('/receiving/:id', authMiddleware, authorize(['read:purchases']), purchaseController.getGoodsReceiptById);
router.put('/receiving/:id', authMiddleware, authorize(['write:purchases']), purchaseController.updateGoodsReceipt);
router.delete('/receiving/:id', authMiddleware, authorize(['delete:purchases']), purchaseController.deleteGoodsReceipt);

export default router;