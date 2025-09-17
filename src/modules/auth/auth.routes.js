import { Router } from 'express';
import * as authController from './auth.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/reset-password', authMiddleware, authorize(['write:users']), authController.resetPassword);
router.put('/change-password', authMiddleware, authController.changePassword);

export default router;
