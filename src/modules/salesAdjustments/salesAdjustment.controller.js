import * as salesAdjustmentService from './salesAdjustment.service.js';


/**
 * @namespace SalesAdjustmentController
 * @description Handles incoming HTTP requests for sales adjustments.
 */

/**
 * Handles the creation of a new sales adjustment request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SalesAdjustmentController
 */
export const createSalesAdjustment = async (req, res) => {
  try {
    const { saleId, reason, items } = req.body;
    const requestedById = req.user.id;

    const salesAdjustment = await salesAdjustmentService.createSalesAdjustment({
      saleId,
      reason,
      items,
      requestedById
    });

    res.status(201).json({ success: true, data: salesAdjustment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Responds with a list of all sales adjustments.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SalesAdjustmentController
 */
export const getSalesAdjustments = async (req, res) => {
  try {
    const { status, saleId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await salesAdjustmentService.getSalesAdjustments({
      status,
      saleId: saleId ? parseInt(saleId) : undefined,
      page,
      limit
    });


   // console.log(result)

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handles the approval of a sales adjustment request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SalesAdjustmentController
 */
export const approveSalesAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedById = req.user.id;

    const salesAdjustment = await salesAdjustmentService.approveAdjustment(
      parseInt(id),
      approvedById
    );

    res.json({ success: true, data: salesAdjustment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles the decline of a sales adjustment request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof SalesAdjustmentController
 */
export const declineSalesAdjustment = async (req, res) => {
  try {
    const { id } = req.params;
    const declinedById = req.user.id;

    const salesAdjustment = await salesAdjustmentService.declineAdjustment(
      parseInt(id),
      declinedById
    );

    res.json({ success: true, data: salesAdjustment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};