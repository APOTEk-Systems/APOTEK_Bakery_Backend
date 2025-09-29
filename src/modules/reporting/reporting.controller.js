import * as reportingService from './reporting.service.js';

/**
 * @namespace ReportingController
 * @description Handles incoming HTTP requests for reports.
 */

/**
 * Responds with a sales report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getSalesReport = async (req, res) => {
  const report = await reportingService.generateSalesReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with an inventory report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getInventoryReport = async (req, res) => {
  const report = await reportingService.generateInventoryReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with a customer report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getCustomerReport = async (req, res) => {
  const report = await reportingService.generateCustomerReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with a financial report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getFinancialReport = async (req, res) => {
  const report = await reportingService.generateFinancialReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with a production report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getProductionReport = async (req, res) => {
  const report = await reportingService.generateProductionReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with an audit log report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getAuditReport = async (req, res) => {
  const report = await reportingService.generateAuditReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with an expense breakdown report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getExpenseBreakdownReport = async (req, res) => {
  const report = await reportingService.generateExpenseBreakdownReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with an outstanding payments report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getOutstandingPaymentsReport = async (req, res) => {
  const report = await reportingService.generateOutstandingPaymentsReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with an ingredient usage report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getIngredientUsageReport = async (req, res) => {
  const report = await reportingService.generateIngredientUsageReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with a finished goods summary report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getFinishedGoodsSummary = async (req, res) => {
  const report = await reportingService.generateFinishedGoodsSummary(req.query);
  res.json({ data: report });
};

/**
 * Responds with a stock adjustment report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getStockAdjustmentReport = async (req, res) => {
  const report = await reportingService.generateStockAdjustmentReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with an ingredient purchase trend report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getIngredientPurchaseTrend = async (req, res) => {
  const report = await reportingService.generateIngredientPurchaseTrend(req.query);
  res.json({ data: report });
};

/**
 * Responds with a supplier-wise purchases report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getPurchasesBySupplierReport = async (req, res) => {
  const report = await reportingService.generatePurchasesBySupplierReport(req.query);
  res.json({ data: report });
};

/**
 * Responds with a purchases report.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof ReportingController
 */
export const getPurchasesReport = async (req, res) => {
  const report = await reportingService.generatePurchasesReport(req.query);
  res.json({ data: report });
};
