import { Router } from 'express';
import * as productController from './product.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products.
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
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *                   instructions:
 *                     type: array
 *                     items:
 *                       type: string
 *                   prepTime:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   batchSize:
 *                     type: integer
 *                   status:
 *                     type: string
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
 *                   productRecipes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         productId:
 *                           type: integer
 *                         inventoryItemId:
 *                           type: integer
 *                         amountRequired:
 *                           type: number
 *                         inventoryItem:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             unit:
 *                               type: string
 */
router.get('/', authMiddleware, authorize(['view:products']), productController.getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               prepTime:
 *                 type: integer
 *               batchSize:
 *                 type: integer
 *               status:
 *                 type: string
 *               productRecipes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryItemId:
 *                       type: integer
 *                     amountRequired:
 *                       type: number
 *     responses:
 *       201:
 *         description: The created product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 image:
 *                   type: string
 *                 instructions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 prepTime:
 *                   type: integer
 *                 quantity:
 *                   type: integer
 *                 batchSize:
 *                   type: integer
 *                 status:
 *                   type: string
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
 *                 productRecipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       productId:
 *                           type: integer
 *                       inventoryItemId:
 *                           type: integer
 *                       amountRequired:
 *                           type: number
 *                       inventoryItem:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             unit:
 *                               type: string
 */
router.post('/', authMiddleware, authorize(['create:products']), productController.createNewProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: A single product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 image:
 *                   type: string
 *                 instructions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 prepTime:
 *                   type: integer
 *                 quantity:
 *                   type: integer
 *                 batchSize:
 *                   type: integer
 *                 status:
 *                   type: string
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
 *                 productRecipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       productId:
 *                           type: integer
 *                       inventoryItemId:
 *                           type: integer
 *                       amountRequired:
 *                           type: number
 *                       inventoryItem:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             unit:
 *                               type: string
 *       404:
 *         description: Product not found.
 */
router.get('/:id', authMiddleware, authorize(['view:products']), productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               prepTime:
 *                 type: integer
 *               batchSize:
 *                 type: integer
 *               status:
 *                 type: string
 *               productRecipes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     inventoryItemId:
 *                       type: integer
 *                     amountRequired:
 *                       type: number
 *     responses:
 *       200:
 *         description: The updated product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 image:
 *                   type: string
 *                 instructions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 prepTime:
 *                   type: integer
 *                 quantity:
 *                   type: integer
 *                 batchSize:
 *                   type: integer
 *                 status:
 *                   type: string
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
 *                 productRecipes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       productId:
 *                           type: integer
 *                       inventoryItemId:
 *                           type: integer
 *                       amountRequired:
 *                           type: number
 *                       inventoryItem:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             unit:
 *                               type: string
 *       404:
 *         description: Product not found.
 */
router.put('/:id', authMiddleware, authorize(['update:products']), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     responses:
 *       204:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 */
router.delete('/:id', authMiddleware, authorize(['delete:products']), productController.deleteProduct);

export default router;