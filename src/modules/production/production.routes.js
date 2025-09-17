import { Router } from "express";
import {
  createRunHandler,
  updateRunHandler,
  finalizeRunHandler,
  listRunsHandler,
} from "./production.controller.js";
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.post("/", authMiddleware, authorize(['write:production']), createRunHandler);
router.put("/:id", authMiddleware, authorize(['write:production']), updateRunHandler);
router.patch("/:id/finalize", authMiddleware, authorize(['write:production']), finalizeRunHandler);
router.get("/", authMiddleware, authorize(['read:production']), listRunsHandler);

export default router;
