import { Router } from 'express';
import { getAllSuppliers, getPurchaseOrdersBySupplierId, createSupplier, updateSupplier, deleteSupplier } from './supplier.controller.js';
import auth from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', auth, getAllSuppliers);
router.get('/:id/po', auth, getPurchaseOrdersBySupplierId);
router.post('/', auth, createSupplier);
router.put('/:id', auth, updateSupplier);
router.delete('/:id', auth, deleteSupplier);

export default router;