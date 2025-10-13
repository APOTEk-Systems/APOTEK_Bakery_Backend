import { Router } from 'express';
import * as settingsController from './settings.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['view:settings']), settingsController.getSettings);
router.put('/', authMiddleware, authorize(['update:settings']), settingsController.updateSettings);

router.post("/reasons", authMiddleware, authorize(['update:settings']), settingsController.createAdjustmentReasonHandler);
router.get("/reasons", authMiddleware, authorize(['view:settings']), settingsController.getAdjustmentReasonsHandler);
router.get("/reasons/:id", authMiddleware, authorize(['view:settings']), settingsController.getAdjustmentReasonHandler);
router.patch("/reasons/:id", authMiddleware, authorize(['update:settings']), settingsController.updateAdjustmentReasonHandler);
router.delete("/reasons/:id", authMiddleware, authorize(['update:settings']), settingsController.deleteAdjustmentReasonHandler);

export default router;