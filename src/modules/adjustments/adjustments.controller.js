import { createInventoryAdjustment, listInventoryAdjustments } from "./adjustments.service.js";

export async function createAdjustmentHandler(req, res) {
  try {
    const { inventoryItemId, amount, reason } = req.body;
    const createdById = req.user.id;

    const result = await createInventoryAdjustment({
      inventoryItemId,
      amount,
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
    const { date, type } = req.query;
    const adjustments = await listInventoryAdjustments({ date, type });
    res.json(adjustments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
