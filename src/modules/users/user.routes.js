
import { Router } from 'express';
import * as userController from './user.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, authorize(['read:users']), userController.getUsers);
router.post('/', authMiddleware, authorize(['write:users']), userController.createNewUser);
router.get('/:id', authMiddleware, authorize(['read:users']), userController.getUserById);
router.put('/:id', authMiddleware, authorize(['write:users']), userController.updateUser);
router.delete('/:id', authMiddleware, authorize(['delete:users']), userController.deleteUser);

export default router;
