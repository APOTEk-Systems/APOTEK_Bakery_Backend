
import * as saleService from './sale.service.js';

/**
 * @namespace SaleController
 * @description Handles incoming HTTP requests for sales.
 */

/**
 * Responds with a list of all sales.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SaleController
 */
export const getSales = async (req, res) => {
  const { date, isCredit, status, endDate, startDate, customerName } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const sales = await saleService.getAllSales({
    date,
    isCredit,
    status,
    limit,
    endDate,
    startDate,
    page,
    customerName,
  });
  res.json(sales);
};

/**
 * Handles the creation of a new sale.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SaleController
 */
export const createNewSale = async (req, res) => {
  try {
    const { sale, outstandingPayments } = await saleService.createSale(req.body, req.user.id);
    res.status(201).json({ sale, outstandingPayments });
  } catch (error) {
    res.status(400).json({ message: error.message }); // Return the actual error message
  }
};

/**
 * Responds with a single sale by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SaleController
 */
export const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(parseInt(req.params.id));
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handles the update of an existing sale.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SaleController
 */
export const updateSale = async (req, res) => {
  try {
    const updatedSale = await saleService.updateSale(parseInt(req.params.id), req.body);
    if (updatedSale) {
      res.json(updatedSale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles the payment of a sale.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SaleController
 */
export const deleteSale = async (req, res) => {
  try {
    const deleted = await saleService.deleteSale(parseInt(req.params.id));
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCreditPayment = async (req, res) => {
  try {
    const payment = await saleService.createCreditPayment(
      parseInt(req.params.id),
      req.body,
      req.user.id
    );
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPaymentsForSale = async (req, res) => {
  try {
    const payments = await saleService.getPaymentsForSale(parseInt(req.params.id));
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Similar to getSales but only for credit payments
export const getAllCreditPayments = async (req, res) => {
  try {
    const payments = await saleService.getAllCreditPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesSummary = async (req, res) => {
  const summary = await saleService.getSalesSummary();
  res.json(summary);
};
