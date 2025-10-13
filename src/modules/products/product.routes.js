import { Router } from 'express';
import * as productController from './product.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['view:products']), productController.getProducts);
router.post('/', authMiddleware, authorize(['create:products']), productController.createNewProduct);
router.get('/:id', authMiddleware, authorize(['view:products']), productController.getProductById);
router.put('/:id', authMiddleware, authorize(['update:products']), productController.updateProduct);
router.delete('/:id', authMiddleware, authorize(['delete:products']), productController.deleteProduct);

export default router;