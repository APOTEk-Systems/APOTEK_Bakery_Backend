import { Router } from 'express';
import * as inventoryController from './inventory.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/summary', authMiddleware, authorize(['view:inventory']), inventoryController.getInventorySummary);
router.get('/', authMiddleware, authorize(['view:inventory']), inventoryController.getInventoryItems);
router.post('/', authMiddleware, authorize(['create:inventory']), inventoryController.createNewInventoryItem);
router.get('/:id', authMiddleware, authorize(['view:inventory']), inventoryController.getInventoryItemById);
router.put('/:id', authMiddleware, authorize(['update:inventory']), inventoryController.updateInventoryItem);
router.delete('/:id', authMiddleware, authorize(['delete:inventory']), inventoryController.deleteInventoryItem);


export default router;