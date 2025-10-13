import { Router } from 'express';
import * as accountingController from './accounting.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Expense routes
router.get('/expenses', authMiddleware, authorize(['view:expenses']), accountingController.getExpenses);
router.get('/expenses/summary', authMiddleware, authorize(['view:expenses']), accountingController.getExpensesSummary);
router.get('/expenses/:id', authMiddleware, authorize(['view:expenses']), accountingController.getExpenseById);
router.post('/expenses', authMiddleware, authorize(['create:expenses']), accountingController.createNewExpense);
router.put('/expenses/:id', authMiddleware, authorize(['update:expenses']), accountingController.updateExpense);
router.put('/expenses/:id/status', authMiddleware, authorize(['approve:expenses']), accountingController.updateExpenseStatus);
router.delete('/expenses/:id', authMiddleware, authorize(['delete:expenses']), accountingController.deleteExpense);

// Expense Category routes
router.post('/expense-categories', authMiddleware, authorize(['create:expenses']), accountingController.addExpenseCategory);
router.get('/expense-categories', authMiddleware, authorize(['view:expenses']), accountingController.getExpenseCategories);
router.get('/expense-categories/:id', authMiddleware, authorize(['view:expenses']), accountingController.getExpenseCategoryById);
router.put('/expense-categories/:id', authMiddleware, authorize(['update:expenses']), accountingController.updateExpenseCategory);
router.delete('/expense-categories/:id', authMiddleware, authorize(['delete:expenses']), accountingController.deleteExpenseCategory);

// Report routes
router.get('/reports', authMiddleware, authorize(['view:reports']), accountingController.getFinancialReport);

// Summary
router.get('/summary', authMiddleware, authorize(['view:expenses']), accountingController.getAccountingSummary);

export default router;