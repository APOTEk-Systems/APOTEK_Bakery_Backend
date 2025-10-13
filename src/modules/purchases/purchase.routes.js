import { Router } from 'express';
import * as purchaseController from './purchase.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/summary', authMiddleware, authorize(['view:purchases']), purchaseController.getPurchasesSummary);
router.get('/orders', authMiddleware, authorize(['view:purchases']), purchaseController.getPurchaseOrders);
router.post('/orders', authMiddleware, authorize(['create:purchases']), purchaseController.createNewPurchaseOrder);
router.get('/orders/:id', authMiddleware, authorize(['view:purchases']), purchaseController.getPurchaseOrderById);
router.put('/orders/:id', authMiddleware, authorize(['update:purchases']), purchaseController.updatePurchaseOrder);
router.patch('/orders/:id/status', authMiddleware, authorize(['approve:purchases']), purchaseController.updatePurchaseOrderStatus);
router.delete('/orders/:id', authMiddleware, authorize(['delete:purchases']), purchaseController.deletePurchaseOrder);
router.get('/receiving', authMiddleware, authorize(['view:purchases']), purchaseController.getGoodsReceipts);
router.post('/receiving', authMiddleware, authorize(['receive:goods']), purchaseController.createNewGoodsReceipt);
router.get('/receiving/:id', authMiddleware, authorize(['view:purchases']), purchaseController.getGoodsReceiptById);
router.put('/receiving/:id', authMiddleware, authorize(['receive:goods']), purchaseController.updateGoodsReceipt);
router.delete('/receiving/:id', authMiddleware, authorize(['delete:purchases']), purchaseController.deleteGoodsReceipt);



export default router;