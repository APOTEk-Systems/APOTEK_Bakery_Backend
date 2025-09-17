import { Router } from 'express';
import * as productController from './product.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['read:products']), productController.getProducts);
router.post('/', authMiddleware, authorize(['write:products']), productController.createNewProduct);
router.get('/:id', authMiddleware, authorize(['read:products']), productController.getProductById);
router.put('/:id', authMiddleware, authorize(['write:products']), productController.updateProduct);
router.delete('/:id', authMiddleware, authorize(['delete:products']), productController.deleteProduct);

export default router;