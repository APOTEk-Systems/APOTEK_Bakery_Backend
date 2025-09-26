import { Router } from 'express';
import * as accountingController from './accounting.controller.js';
import authMiddleware, { authorize } from '../../middleware/auth.middleware.js';

const router = Router();

// Expense routes
router.get('/expenses', authMiddleware, authorize(['read:expenses']), accountingController.getExpenses);
router.get('/expenses/summary', authMiddleware, authorize(['read:expenses']), accountingController.getExpensesSummary);
router.get('/expenses/:id', authMiddleware, authorize(['read:expenses']), accountingController.getExpenseById);
router.post('/expenses', authMiddleware, authorize(['write:expenses']), accountingController.createNewExpense);
router.put('/expenses/:id', authMiddleware, authorize(['write:expenses']), accountingController.updateExpense);
router.put('/expenses/:id/status', authMiddleware, authorize(['write:expenses']), accountingController.updateExpenseStatus);
router.delete('/expenses/:id', authMiddleware, authorize(['delete:expenses']), accountingController.deleteExpense);

// Expense Category routes
router.post('/expense-categories', authMiddleware, authorize(['write:expenses']), accountingController.addExpenseCategory);
router.get('/expense-categories', authMiddleware, authorize(['read:expenses']), accountingController.getExpenseCategories);
router.get('/expense-categories/:id', authMiddleware, authorize(['read:expenses']), accountingController.getExpenseCategoryById);
router.put('/expense-categories/:id', authMiddleware, authorize(['write:expenses']), accountingController.updateExpenseCategory);
router.delete('/expense-categories/:id', authMiddleware, authorize(['delete:expenses']), accountingController.deleteExpenseCategory);

// Report routes
router.get('/reports', authMiddleware, authorize(['read:reports']), accountingController.getFinancialReport);

// Summary
router.get('/summary', authMiddleware, authorize(['read:expenses']), accountingController.getAccountingSummary);

export default router;