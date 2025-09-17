import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { createAdjustmentHandler, listAdjustmentsHandler } from "./adjustments.controller.js";

const router = Router();

router.post("/", authMiddleware, createAdjustmentHandler);
router.get("/", authMiddleware, listAdjustmentsHandler);

export default router;
