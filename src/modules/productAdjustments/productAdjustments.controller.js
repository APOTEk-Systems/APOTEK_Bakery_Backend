import * as ProductAdjustmentService from "./productAdjustments.service.js";

export async function createProductAdjustment(req, res, next) {
  try {
    const { productId, amount, reason } = req.body;
    const createdById = req.user.id; // Assuming user ID is available on req.user

    if (!productId || amount === undefined || !reason) {
      return res.status(400).json({ message: "Missing required fields: productId, amount, reason" });
    }

    const result = await ProductAdjustmentService.createProductAdjustment({
      productId,
      amount,
      reason,
      createdById,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listProductAdjustments(req, res, next) {
  try {
    const { startDate, endDate, name, page, limit, search } = req.query;
    const result = await ProductAdjustmentService.listProductAdjustments({
      startDate,
      endDate,
      name,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
