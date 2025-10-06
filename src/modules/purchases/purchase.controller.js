
import * as purchaseService from './purchase.service.js';

/**
 * @namespace PurchaseController
 * @description Handles incoming HTTP requests for purchases.
 */

/**
 * Responds with a list of all purchase orders.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const getPurchaseOrders = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    endDate,
    search,
  } = req.query;
  const purchaseOrders = await purchaseService.getAllPurchaseOrders({
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    startDate,
    endDate,
    search,
  });
  res.json(purchaseOrders);
};

/**
 * Handles the creation of a new purchase order.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const createNewPurchaseOrder = async (req, res) => {
  const newPurchaseOrder = await purchaseService.createPurchaseOrder(req.body, req.user.id);
  res.status(201).json(newPurchaseOrder);
};

/**
 * Responds with a list of all goods receipts.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const getGoodsReceipts = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    endDate,
    search,
  } = req.query;
  const goodsReceipts = await purchaseService.getAllGoodsReceipts({
    page: parseInt(page),
    limit: parseInt(limit),
    status,
    startDate,
    endDate,
    search,
  });
  res.json(goodsReceipts);
};

/**
 * Handles the creation of a new goods receipt.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const createNewGoodsReceipt = async (req, res) => {
  const newGoodsReceipt = await purchaseService.createGoodsReceipt(req.body, req.user.id);
  res.status(201).json(newGoodsReceipt);
};

/**
 * Responds with a single purchase order by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const getPurchaseOrderById = async (req, res) => {
  try {
    const purchaseOrder = await purchaseService.getPurchaseOrderById(parseInt(req.params.id));
    if (purchaseOrder) {
      res.json(purchaseOrder);
    } else {
      res.status(404).json({ message: 'Purchase Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handles the update of an existing purchase order.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const updatePurchaseOrder = async (req, res) => {
  try {
    const updatedPurchaseOrder = await purchaseService.updatePurchaseOrder(req.params.id, req.body);
    if (updatedPurchaseOrder) {
      res.json(updatedPurchaseOrder);
    } else {
      res.status(404).json({ message: 'Purchase Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles the update of an existing purchase order's status.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const updatePurchaseOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedPurchaseOrder = await purchaseService.updatePurchaseOrderStatus(req.params.id, status);
    if (updatedPurchaseOrder) {
      res.json(updatedPurchaseOrder);
    } else {
      res.status(404).json({ message: 'Purchase Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles the deletion of a purchase order.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const deletePurchaseOrder = async (req, res) => {
  try {
    const deleted = await purchaseService.deletePurchaseOrder(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Purchase Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Responds with a single goods receipt by ID.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const getGoodsReceiptById = async (req, res) => {
  try {
    const goodsReceipt = await purchaseService.getGoodsReceiptById(req.params.id);
    if (goodsReceipt) {
      res.json(goodsReceipt);
    } else {
      res.status(404).json({ message: 'Goods Receipt not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Handles the update of an existing goods receipt.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const updateGoodsReceipt = async (req, res) => {
  try {
    const updatedGoodsReceipt = await purchaseService.updateGoodsReceipt(req.params.id, req.body);
    if (updatedGoodsReceipt) {
      res.json(updatedGoodsReceipt);
    } else {
      res.status(404).json({ message: 'Goods Receipt not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handles the deletion of a goods receipt.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @memberof PurchaseController
 */
export const deleteGoodsReceipt = async (req, res) => {
  try {
    const deleted = await purchaseService.deleteGoodsReceipt(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Goods Receipt not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchasesSummary = async (req, res) => {
  const summary = await purchaseService.getPurchaseSummary();
  res.json(summary);
};
