import {
  createProductionRun,
  updateProductionRun,
  finalizeProductionRun,
  listProductionRuns,
  getProductionRunById,
  getDetailedProducts,
  deleteProductionRun,
} from "./production.service.js";

export async function getDetailedProductsHandler(req, res) {
  try {
    const products = await getDetailedProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function createRunHandler(req, res) {
  try {
   // console.log(req.user.id)
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
    const { startDate, endDate, productName, page, limit } = req.query;
    const runs = await listProductionRuns({ startDate, endDate, productName, page, limit });
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

export async function deleteRunHandler(req, res) {
  try {
    const runId = Number(req.params.id);
    const userId = req.user.id;
    const result = await deleteProductionRun(runId, userId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
