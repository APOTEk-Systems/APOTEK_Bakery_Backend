import express from "express";
import * as ProductAdjustmentController from "./productAdjustments.controller.js";
import authMiddleware, { authorize } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorize(['create:product-adjustments']),
  ProductAdjustmentController.createProductAdjustment
);

router.get(
  "/",
  authMiddleware,
  authorize(['view:product-adjustments']),
  ProductAdjustmentController.listProductAdjustments
);

export default router;
