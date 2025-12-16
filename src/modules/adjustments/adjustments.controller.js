import { createInventoryAdjustment, listInventoryAdjustments } from "./adjustments.service.js";

export async function createAdjustmentHandler(req, res) {
  try {
    const { inventoryItemId, amount, unit, reason } = req.body;
    const createdById = req.user.id;

    const result = await createInventoryAdjustment({
      inventoryItemId,
      amount,
      unit,
      reason,
      createdById,
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listAdjustmentsHandler(req, res) {
  try {
    const { startDate, endDate, type, name, page, limit, search } = req.query;
    const adjustments = await listInventoryAdjustments({
      startDate,
      endDate,
      type,
      name,
      page: +page || 1,
      limit: +limit || 10,
      search,
    });
    res.json(adjustments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
