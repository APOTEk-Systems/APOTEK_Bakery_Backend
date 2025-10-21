import { Router } from 'express';
import * as inventoryController from './inventory.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management endpoints
 */

/**
 * @swagger
 * /api/inventory/summary:
 *   get:
 *     summary: Get inventory summary
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory summary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lowStockRawMaterials:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       minLevel:
 *                         type: integer
 *                 lowStockSupplies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       minLevel:
 *                         type: integer
 *                 outOfStockItems:
 *                   type: integer
 */
router.get('/summary', authMiddleware, authorize(['view:inventory']), inventoryController.getInventorySummary);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by item type (raw_material or supply).
 *     responses:
 *       200:
 *         description: A list of inventory items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   unit:
 *                     type: string
 *                   currentQuantity:
 *                     type: number
 *                   minLevel:
 *                     type: number
 *                   cost:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   createdById:
 *                     type: integer
 *                   updatedById:
 *                     type: integer
 */
router.get('/', authMiddleware, authorize(['view:inventory']), inventoryController.getInventoryItems);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - unit
 *               - currentQuantity
 *               - minLevel
 *               - cost
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               unit:
 *                 type: string
 *               currentQuantity:
 *                 type: number
 *               minLevel:
 *                 type: number
 *               cost:
 *                 type: number
 *     responses:
 *       201:
 *         description: The created inventory item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 unit:
 *                   type: string
 *                 currentQuantity:
 *                   type: number
 *                 minLevel:
 *                   type: number
 *                 cost:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 createdById:
 *                   type: integer
 *                 updatedById:
 *                   type: integer
 */
router.post('/', authMiddleware, authorize(['create:inventory']), inventoryController.createNewInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get a single inventory item by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory item ID.
 *     responses:
 *       200:
 *         description: A single inventory item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 unit:
 *                   type: string
 *                 currentQuantity:
 *                   type: number
 *                 minLevel:
 *                   type: number
 *                 cost:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 createdById:
 *                   type: integer
 *                 updatedById:
 *                   type: integer
 *       404:
 *         description: Inventory item not found.
 */
router.get('/:id', authMiddleware, authorize(['view:inventory']), inventoryController.getInventoryItemById);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory item ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               unit:
 *                 type: string
 *               currentQuantity:
 *                 type: number
 *               minLevel:
 *                 type: number
 *               cost:
 *                 type: number
 *     responses:
 *       200:
 *         description: The updated inventory item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 unit:
 *                   type: string
 *                 currentQuantity:
 *                   type: number
 *                 minLevel:
 *                   type: number
 *                 cost:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 createdById:
 *                   type: integer
 *                 updatedById:
 *                   type: integer
 *       404:
 *         description: Inventory item not found.
 */
router.put('/:id', authMiddleware, authorize(['update:inventory']), inventoryController.updateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The inventory item ID.
 *     responses:
 *       204:
 *         description: Inventory item deleted successfully.
 *       404:
 *         description: Inventory item not found.
 */
router.delete('/:id', authMiddleware, authorize(['delete:inventory']), inventoryController.deleteInventoryItem);


export default router;