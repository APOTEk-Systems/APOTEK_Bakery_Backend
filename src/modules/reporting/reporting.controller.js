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
