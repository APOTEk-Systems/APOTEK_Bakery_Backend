import { Router } from "express";
import {
  createRunHandler,
  updateRunHandler,
 finalizeRunHandler,
  listRunsHandler,
  getRunHandler,
  getDetailedProductsHandler,
  deleteRunHandler,
} from "./production.controller.js";
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Production
 *   description: Production module
 */

/**
 * @swagger
 * /api/production/detailed:
 *   get:
 *     tags: [Production]
 *     summary: Get detailed product list with production cost and profit
 *     description: This endpoint retrieves a list of all products with their calculated production cost and profit.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/detailed", authMiddleware, authorize(['view:production']), getDetailedProductsHandler);

/**
 * @swagger
 * /api/production:
 *   post:
 *     tags: [Production]
 *     summary: Create a new production run
 *     description: This endpoint creates a new production run.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post("/", authMiddleware, authorize(['create:production']), createRunHandler);

/**
 * @swagger
 * /api/production/{id}:
 *   put:
 *     tags: [Production]
 *     summary: Update a production run
 *     description: This endpoint updates a production run.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantityProduced:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.put("/:id", authMiddleware, authorize(['update:production']), updateRunHandler);

/**
 * @swagger
 * /api/production/{id}/finalize:
 *   patch:
 *     tags: [Production]
 *     summary: Finalize a production run
 *     description: This endpoint finalizes a production run.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successful response
 */
router.patch("/:id/finalize", authMiddleware, authorize(['update:production']), finalizeRunHandler);

/**
 * @swagger
 * /api/production:
 *   get:
 *     tags: [Production]
 *     summary: Get all production runs
 *     description: This endpoint retrieves a paginated list of all production runs. It can be filtered by a date range and product name.
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
 *         name: productName
 *         schema:
 *           type: string
 *         description: The name of the product to filter by.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get("/", authMiddleware, authorize(['view:production']), listRunsHandler);

/**
 * @swagger
 * /api/production/{id}:
 *   get:
 *     tags: [Production]
 *     summary: Get a single production run
 *     description: This endpoint retrieves a single production run by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 */
/**
 * @swagger
 * /api/production/{id}:
 *   delete:
 *     tags: [Production]
 *     summary: Delete a production run
 *     description: This endpoint deletes a production run. It will restore ingredients to inventory and decrement the product quantity.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.delete("/:id", authMiddleware, authorize(['delete:production']), deleteRunHandler);
router.get("/:id", authMiddleware, authorize(['view:production']), getRunHandler);

export default router;