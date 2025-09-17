import { Router } from 'express';
import * as customerController from './customer.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['read:customers']), customerController.getCustomers);
router.post('/', authMiddleware, authorize(['write:customers']), customerController.createNewCustomer);
router.get('/:id', authMiddleware, authorize(['read:customers']), customerController.getCustomerById);
router.put('/:id', authMiddleware, authorize(['write:customers']), customerController.updateCustomer);
router.delete('/:id', authMiddleware, authorize(['delete:customers']), customerController.deleteCustomer);

export default router;