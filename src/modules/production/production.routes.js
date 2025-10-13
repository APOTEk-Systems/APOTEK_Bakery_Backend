import { Router } from "express";
import {
  createRunHandler,
  updateRunHandler,
  finalizeRunHandler,
  listRunsHandler,
  getRunHandler,
} from "./production.controller.js";
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.post("/", authMiddleware, authorize(['create:production']), createRunHandler);
router.put("/:id", authMiddleware, authorize(['update:production']), updateRunHandler);
router.patch("/:id/finalize", authMiddleware, authorize(['update:production']), finalizeRunHandler);
router.get("/", authMiddleware, authorize(['view:production']), listRunsHandler);
router.get("/:id", authMiddleware, authorize(['view:production']), getRunHandler);

export default router;