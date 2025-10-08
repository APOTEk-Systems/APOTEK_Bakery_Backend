import { Router } from 'express';
import * as settingsController from './settings.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['read:settings']), settingsController.getSettings);
router.put('/', authMiddleware, authorize(['write:settings']), settingsController.updateSettings);

router.post("/reasons", authMiddleware, authorize(['write:settings']), settingsController.createAdjustmentReasonHandler);
router.get("/reasons", authMiddleware, authorize(['read:settings']), settingsController.getAdjustmentReasonsHandler);
router.get("/reasons/:id", authMiddleware, authorize(['read:settings']), settingsController.getAdjustmentReasonHandler);
router.patch("/reasons/:id", authMiddleware, authorize(['write:settings']), settingsController.updateAdjustmentReasonHandler);
router.delete("/reasons/:id", authMiddleware, authorize(['write:settings']), settingsController.deleteAdjustmentReasonHandler);

export default router;