import { Router } from 'express';
import * as purchaseController from './purchase.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Purchases
 *   description: Purchases module
 */

/**
 * @swagger
 * /api/purchases/summary:
 *   get:
 *     tags: [Purchases]
 *     summary: Get purchases summary
 *     description: This endpoint retrieves a summary of purchases.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/summary', authMiddleware, authorize(['view:purchases']), purchaseController.getPurchasesSummary);

/**
 * @swagger
 * /api/purchases/orders:
 *   get:
 *     tags: [Purchases]
 *     summary: Get all purchase orders
 *     description: This endpoint retrieves a paginated list of all purchase orders. It can be filtered by status, date range, and a search query.
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by purchase order status.
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
 *         name: search
 *         schema:
 *           type: string
 *         description: A search query to filter by purchase order ID or supplier name.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/orders', authMiddleware, authorize(['view:purchases']), purchaseController.getPurchaseOrders);

/**
 * @swagger
 * /api/purchases/orders:
 *   post:
 *     tags: [Purchases]
 *     summary: Create a new purchase order
 *     description: This endpoint creates a new purchase order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: integer
 *               totalCost:
 *                 type: number
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryItemId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Successful response
 */
router.post('/orders', authMiddleware, authorize(['create:purchases']), purchaseController.createNewPurchaseOrder);

/**
 * @swagger
 * /api/purchases/orders/{id}:
 *   get:
 *     tags: [Purchases]
 *     summary: Get a single purchase order
 *     description: This endpoint retrieves a single purchase order by its ID.
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
router.get('/orders/:id', authMiddleware, authorize(['view:purchases']), purchaseController.getPurchaseOrderById);

/**
 * @swagger
 * /api/purchases/orders/{id}:
 *   put:
 *     tags: [Purchases]
 *     summary: Update a purchase order
 *     description: This endpoint updates a purchase order.
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
 *               supplierId:
 *                 type: integer
 *               totalCost:
 *                 type: number
 *               status:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.put('/orders/:id', authMiddleware, authorize(['update:purchases']), purchaseController.updatePurchaseOrder);

/**
 * @swagger
 * /api/purchases/orders/{id}/status:
 *   patch:
 *     tags: [Purchases]
 *     summary: Update purchase order status
 *     description: This endpoint updates the status of a purchase order.
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.patch('/orders/:id/status', authMiddleware, authorize(['approve:purchases']), purchaseController.updatePurchaseOrderStatus);

/**
 * @swagger
 * /api/purchases/orders/{id}:
 *   delete:
 *     tags: [Purchases]
 *     summary: Delete a purchase order
 *     description: This endpoint deletes a purchase order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successful response
 */
router.delete('/orders/:id', authMiddleware, authorize(['delete:purchases']), purchaseController.deletePurchaseOrder);

/**
 * @swagger
 * /api/purchases/receiving:
 *   get:
 *     tags: [Purchases]
 *     summary: Get all goods receipts
 *     description: This endpoint retrieves a paginated list of all goods receipts. It can be filtered by status, date range, and a search query.
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by goods receipt status.
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
 *         name: search
 *         schema:
 *           type: string
 *         description: A search query to filter by purchase order ID or supplier name.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/receiving', authMiddleware, authorize(['view:receiving']), purchaseController.getGoodsReceipts);

/**
 * @swagger
 * /api/purchases/receiving:
 *   post:
 *     tags: [Purchases]
 *     summary: Create a new goods receipt
 *     description: This endpoint creates a new goods receipt.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchaseOrderId:
 *                 type: integer
 *               receivedDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryItemId:
 *                       type: integer
 *                     receivedQuantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Successful response
 */
router.post('/receiving', authMiddleware, authorize(['receive:goods']), purchaseController.createNewGoodsReceipt);

/**
 * @swagger
 * /api/purchases/receiving/{id}:
 *   get:
 *     tags: [Purchases]
 *     summary: Get a single goods receipt
 *     description: This endpoint retrieves a single goods receipt by its ID.
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
router.get('/receiving/:id', authMiddleware, authorize(['view:receving']), purchaseController.getGoodsReceiptById);

/**
 * @swagger
 * /api/purchases/receiving/{id}:
 *   put:
 *     tags: [Purchases]
 *     summary: Update a goods receipt
 *     description: This endpoint updates a goods receipt.
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
 *               receivedDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.put('/receiving/:id', authMiddleware, authorize(['receive:goods']), purchaseController.updateGoodsReceipt);

/**
 * @swagger
 * /api/purchases/receiving/{id}:
 *   delete:
 *     tags: [Purchases]
 *     summary: Delete a goods receipt
 *     description: This endpoint deletes a goods receipt by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successful response
 */
router.delete('/receiving/:id', authMiddleware, authorize(['delete:purchases']), purchaseController.deleteGoodsReceipt);

/**
 * @swagger
 * /api/purchases/detailed:
 *   get:
 *     tags: [Purchases]
 *     summary: Get detailed list of all purchased items
 *     description: This endpoint retrieves a list of all individual items from all purchase orders, along with purchase details.
 *     parameters:
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
 *         name: supplier
 *         schema:
 *           type: string
 *         description: Filter by supplier name.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/detailed', authMiddleware, authorize(['view:purchases']), purchaseController.getDetailedPurchases);

/**
 * @swagger
 * /api/purchases/detailed-receipts:
 *   get:
 *     tags: [Purchases]
 *     summary: Get detailed list of all received items
 *     parameters:
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
 *         name: supplier
 *         schema:
 *           type: string
 *         description: Filter by supplier name.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/detailed-receipts', authMiddleware, authorize(['view:receiving']), purchaseController.getDetailedReceipts);


export default router;