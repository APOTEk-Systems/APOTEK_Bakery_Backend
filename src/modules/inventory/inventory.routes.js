import { Router } from 'express';
import * as inventoryController from './inventory.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['read:inventory']), inventoryController.getInventoryItems);
router.post('/', authMiddleware, authorize(['write:inventory']), inventoryController.createNewInventoryItem);
router.get('/:id', authMiddleware, authorize(['read:inventory']), inventoryController.getInventoryItemById);
router.put('/:id', authMiddleware, authorize(['write:inventory']), inventoryController.updateInventoryItem);
router.delete('/:id', authMiddleware, authorize(['delete:inventory']), inventoryController.deleteInventoryItem);

export default router;