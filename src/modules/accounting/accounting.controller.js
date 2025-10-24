import * as accountingService from './accounting.service.js';

/**
 * @namespace AccountingController
 * @description Handles incoming HTTP requests for accounting.
 */

/**
 * Responds with a list of all expenses.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const getExpenses = async (req, res) => {
  const expenses = await accountingService.getExpensesList(req.query);
  res.json(expenses);
};

export const getAccountingSummary = async (req, res) =>{
 const accountingSummary = await accountingService.getAccountingSummary();
 res.json(accountingSummary);
}

/**
 * Responds with a single expense by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const getExpenseById = async (req, res) => {
  const expense = await accountingService.getExpenseById(req.params.id);
  if (expense) {
    res.json({ data: expense });
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
};

/**
 * Handles the creation of a new expense.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const createNewExpense = async (req, res) => {
  const newExpense = await accountingService.createExpense({ ...req.body, createdById: req.user.id }); 
  res.status(201).json({ success: true, data: newExpense });
};

/**
 * Handles the update of an existing expense.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const updateExpense = async (req, res) => {
  const updatedExpense = await accountingService.updateExpense(req.params.id, { ...req.body, updatedById: req.user.id });
  if (updatedExpense) {
    res.json({ success: true, data: updatedExpense });
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
};

/**
 * Handles the update of an expense's status.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const updateExpenseStatus = async (req, res) => {
  const { status } = req.body;
  const updatedExpense = await accountingService.updateExpenseStatus(req.params.id, status, req.user.id);
  if (updatedExpense) {
    res.json({ success: true, data: { status: updatedExpense.status, approvedBy: updatedExpense.approvedBy } });
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
};

/**
 * Handles the deletion of an expense.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const deleteExpense = async (req, res) => {
  const deleted = await accountingService.deleteExpense(req.params.id);
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Expense not found' });
  }
};

/**
 * Responds with a financial report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const getFinancialReport = async (req, res) => {
  const report = await accountingService.getAccountingReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with a summary of expenses by category and total.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof AccountingController
 */
export const getExpensesSummary = async (req, res) => {
  const summary = await accountingService.getExpensesSummary(req.query);
  res.json( summary );
};

export const addExpenseCategory = async (req, res) => {
  const { name } = req.body;
  const newExpenseCategory = await accountingService.addExpenseCategory({ name });
  res.status(201).json({ success: true, data: newExpenseCategory });
};

export const getExpenseCategories = async (req, res) => {
  const expenseCategories = await accountingService.getExpenseCategories();
  res.json({ data: expenseCategories });
};

export const getExpenseCategoryById = async (req, res) => {
  const expenseCategory = await accountingService.getExpenseCategoryById(req.params.id);
  if (expenseCategory) {
    res.json({ data: expenseCategory });
  } else {
    res.status(404).json({ error: 'Expense category not found' });
  }
};

export const updateExpenseCategory = async (req, res) => {
  const updatedExpenseCategory = await accountingService.updateExpenseCategory(req.params.id, req.body);
  if (updatedExpenseCategory) {
    res.json({ success: true, data: updatedExpenseCategory });
  } else {
    res.status(404).json({ error: 'Expense category not found' });
  }
};

export const deleteExpenseCategory = async (req, res) => {
  const deleted = await accountingService.deleteExpenseCategory(req.params.id);
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Expense category not found' });
  }
};

export const getProfitAndLossReport = async (req, res) => {
  const report = await accountingService.getProfitAndLossReport(req.query);
  res.json({ data: report });
};

export const getCashFlowReport = async (req, res) => {
  const report = await accountingService.getCashFlowReport(req.query);
  res.json({ data: report });
};