import express from "express";
import {
  createSalesAdjustment,
  getSalesAdjustments,
  approveSalesAdjustment,
  declineSalesAdjustment,
} from "./salesAdjustment.controller.js";
import authMiddleware, { authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Routes for Sales Adjustments
router.post('/', authMiddleware, authorize(['create:sales-adjustments']), createSalesAdjustment);
router.get('/', authMiddleware, authorize(['view:sales-adjustments']), getSalesAdjustments); 
router.patch('/:id/approve', authMiddleware, authorize(['approve:sales-adjustments']), approveSalesAdjustment);
router.patch('/:id/decline', authMiddleware, authorize(['approve:sales-adjustments']), declineSalesAdjustment);

export default router;
