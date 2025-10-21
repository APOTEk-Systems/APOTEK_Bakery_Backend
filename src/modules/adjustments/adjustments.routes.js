import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { createAdjustmentHandler, listAdjustmentsHandler } from "./adjustments.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Adjustments
 *   description: Inventory adjustments management endpoints
 */

/**
 * @swagger
 * /api/adjustments:
 *   post:
 *     summary: Create a new inventory adjustment
 *     tags: [Adjustments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inventoryItemId
 *               - amount
 *               - reason
 *             properties:
 *               inventoryItemId:
 *                 type: integer
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created inventory adjustment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adjustment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     inventoryItemId:
 *                       type: integer
 *                     amount:
 *                       type: number
 *                     reason:
 *                       type: string
 *                     createdById:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 inventoryItem:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     unit:
 *                       type: string
 *                     currentQuantity:
 *                       type: number
 *                     minLevel:
 *                       type: number
 *                     cost:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     createdById:
 *                       type: integer
 *                     updatedById:
 *                       type: integer
 */
router.post("/", authMiddleware, createAdjustmentHandler);

/**
 * @swagger
 * /api/adjustments:
 *   get:
 *     summary: Get all inventory adjustments
 *     tags: [Adjustments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve. Defaults to 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to retrieve per page. Defaults to 10.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date of the date range to filter by.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date of the date range to filter by.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by item type (raw_material or supply).
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by item name.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search query to filter by item name or reason.
 *     responses:
 *       200:
 *         description: A list of inventory adjustments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adjustments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       inventoryItemId:
 *                         type: integer
 *                       amount:
 *                         type: number
 *                       reason:
 *                         type: string
 *                       createdById:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       inventoryItem:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           type:
 *                             type: string
 *                       createdBy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
router.get("/", authMiddleware, listAdjustmentsHandler);

export default router;