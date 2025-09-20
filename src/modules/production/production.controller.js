
import {
  createProductionRun,
  updateProductionRun,
  finalizeProductionRun,
  listProductionRuns,
  getProductionRunById,
} from "./production.service.js";

export async function createRunHandler(req, res) {
  try {
    console.log(req.user.id)
    const { productId, quantity, notes } = req.body;
    const run = await createProductionRun({
      productId,
      quantityProduced: quantity,
      producedById: req.user.id,
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

export async function getRunHandler(req, res) {
  try {
    const run = await getProductionRunById(Number(req.params.id));
    res.json(run);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
