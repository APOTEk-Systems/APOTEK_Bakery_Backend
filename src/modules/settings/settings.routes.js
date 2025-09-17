import { Router } from 'express';
import * as settingsController from './settings.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['read:settings']), settingsController.getSettings);
router.put('/', authMiddleware, authorize(['write:settings']), settingsController.updateSettings);

export default router;