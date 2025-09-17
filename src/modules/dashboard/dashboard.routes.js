
import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import * as dashboardController from './dashboard.controller.js';

const router = express.Router();

router.get('/', authMiddleware, dashboardController.getDashboardData);

export default router;

