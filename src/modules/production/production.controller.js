
import {
  createProductionRun,
  updateProductionRun,
  finalizeProductionRun,
  listProductionRuns,
} from "./production.service.js";

export async function createRunHandler(req, res) {
  try {
    const { productId, quantity, notes } = req.body;
    const run = await createProductionRun({
      productId,
      quantityProduced: quantity,
      producedById: req.userId,
      notes,
    });
    res.json(run);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateRunHandler(req, res) {
  try {
    const run = await updateProductionRun(Number(req.params.id), req.body);
    res.json(run);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function finalizeRunHandler(req, res) {
  try {
    const run = await finalizeProductionRun(Number(req.params.id), req.body.userId);
    res.json(run);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function listRunsHandler(req, res) {
  try {
    const { date } = req.query;
    const runs = await listProductionRuns(date);
    res.json(runs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
