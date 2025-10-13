import { Router } from 'express';
import { getAllSuppliers, getPurchaseOrdersBySupplierId, createSupplier, updateSupplier, deleteSupplier } from './supplier.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['view:suppliers']), getAllSuppliers);
router.get('/:id/po', authMiddleware, authorize(['view:suppliers']), getPurchaseOrdersBySupplierId);
router.post('/', authMiddleware, authorize(['create:suppliers']), createSupplier);
router.put('/:id', authMiddleware, authorize(['update:suppliers']), updateSupplier);
router.delete('/:id', authMiddleware, authorize(['delete:suppliers']), deleteSupplier);

export default router;