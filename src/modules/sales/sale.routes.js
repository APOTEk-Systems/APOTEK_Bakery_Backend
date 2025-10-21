import { Router } from 'express';
import * as saleController from './sale.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales module
 */

/**
 * @swagger
 * /api/sales:
 *   get:
 *     tags: [Sales]
 *     summary: Get all sales
 *     description: This endpoint retrieves a paginated list of all sales. It can be filtered by a date range, credit status, and sale status.
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
 *         name: isCredit
 *         schema:
 *           type: boolean
 *         description: Filter by credit status.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by sale status.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', authMiddleware, authorize(['view:sales']), saleController.getSales);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     tags: [Sales]
 *     summary: Create a new sale
 *     description: This endpoint creates a new sale.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               isCredit:
 *                 type: boolean
 *               creditDueDate:
 *                 type: string
 *                 format: date-time
 *               total:
 *                 type: number
 *               status:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     notes:
 *                       type: string
 *     responses:
 *       201:
 *         description: Successful response
 */
router.post('/', authMiddleware, authorize(['create:sales']), saleController.createNewSale);

/**
 * @swagger
 * /api/sales/summary:
 *   get:
 *     tags: [Sales]
 *     summary: Get sales summary
 *     description: This endpoint retrieves a summary of sales.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/summary', authMiddleware, authorize(['view:sales']), saleController.getSalesSummary);

/**
 * @swagger
 * /api/sales/payments:
 *   get:
 *     tags: [Sales]
 *     summary: Get all credit payments
 *     description: This endpoint retrieves a list of all credit payments.
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/payments', authMiddleware, authorize(['view:sales']), saleController.getAllCreditPayments);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     tags: [Sales]
 *     summary: Get a single sale
 *     description: This endpoint retrieves a single sale by its ID.
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
router.get('/:id', saleController.getSaleById);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     tags: [Sales]
 *     summary: Update a sale
 *     description: This endpoint updates a sale.
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
 *               customerId:
 *                 type: integer
 *               isCredit:
 *                 type: boolean
 *               creditDueDate:
 *                 type: string
 *                 format: date-time
 *               total:
 *                 type: number
 *               status:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     notes:
 *                       type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
router.put('/:id', authMiddleware, authorize(['update:sales']), saleController.updateSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     tags: [Sales]
 *     summary: Delete a sale
 *     description: This endpoint deletes a sale by its ID.
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
router.delete('/:id', authMiddleware, authorize(['delete:sales']), saleController.deleteSale);

// Credit Payments
/**
 * @swagger
 * /api/sales/{id}/payments:
 *   post:
 *     tags: [Sales]
 *     summary: Create a new payment for a sale
 *     description: This endpoint creates a new payment for a sale.
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
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Successful response
 */
router.post('/:id/payments', authMiddleware, authorize(['create:sales']), saleController.createCreditPayment);

/**
 * @swagger
 * /api/sales/{id}/payments:
 *   get:
 *     tags: [Sales]
 *     summary: Get all payments for a sale
 *     description: This endpoint retrieves all payments for a sale.
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
router.get('/:id/payments', authMiddleware, authorize(['view:sales']), saleController.getPaymentsForSale);

export default router;
