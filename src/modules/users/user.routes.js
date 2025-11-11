import { Router } from 'express';
import * as userController from './user.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/roles', authMiddleware, authorize(['view:users']), userController.getRoles);
router.post('/roles', authMiddleware, authorize(['manage:roles']), userController.createNewRole);
router.get('/roles/:id', authMiddleware, authorize(['view:users']), userController.getRoleById);
router.put('/roles/:id', authMiddleware, authorize(['update:roles']), userController.updateRole);
router.delete('/roles/:id', authMiddleware, authorize(['delete:roles']), userController.deleteRole);

router.get('/', authMiddleware, authorize(['view:users']), userController.getUsers);
router.post('/', authMiddleware, authorize(['create:users']), userController.createNewUser);
router.get('/:id', authMiddleware, authorize(['view:users']), userController.getUserById);
router.put('/:id', authMiddleware, authorize(['update:users']), userController.updateUser);
router.delete('/:id', authMiddleware, authorize(['delete:users']), userController.deleteUser);



export default router;