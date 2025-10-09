import { PrismaClient } from "@prisma/client";
import { deductInventoryForProduction } from "../inventory/inventory.service.js";
const prisma = new PrismaClient();

// Create a production run
export async function createProductionRun({
  productId,
  quantityProduced,
  producedById,
  notes,
}) {
  console.log(`Starting production run for Product ID: ${productId}, Quantity: ${quantityProduced}`);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { productRecipes: true },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (quantityProduced % product.batchSize !== 0) {
    throw new Error(`Quantity produced must be a multiple of the batch size (${product.batchSize}).`);
  }

  if (!product.productRecipes.length) {
    throw new Error("No recipe found for this product.");
  }

  const ingredientsToDeduct = product.productRecipes.map(recipe => ({
    inventoryItemId: recipe.inventoryItemId,
    amountDeducted: (quantityProduced / product.batchSize) * recipe.amountRequired,
  }));

  // Step 1: Deduct inventory and get the cost details from the inventory service
  const deductionResults = await deductInventoryForProduction(ingredientsToDeduct);
  console.log("Ingredients successfully deducted from inventory.");

  // Step 2: Calculate total cost from the results of the deduction
  const totalCost = deductionResults.reduce((acc, result) => acc + result.cost, 0);

  // Step 3: Create the production run and the ingredient deduction records
  const run = await prisma.productionRun.create({
    data: {
      productId,
      quantityProduced,
      producedById,
      notes,
      status: "PENDING",
      updatedById: producedById,
      cost: totalCost,
      ingredientsDeducted: {
        create: deductionResults.map(result => ({
          inventoryItemId: result.inventoryItemId,
          amountDeducted: result.amountDeducted,
          cost: result.cost, // <-- This is the new field being populated
        })),
      },
    },
  });
  console.log(`Production run ${run.id} created.`);

  // Step 4: Increment the product quantity
  await prisma.product.update({
    where: { id: productId },
    data: { quantity: { increment: quantityProduced } },
  });
  console.log(`Product quantity for ID ${productId} incremented by ${quantityProduced}.`);

  console.log("Production run successfully completed.");
  return run;
}

// Update a production run
export async function updateProductionRun(
  runId,
  { quantityProduced, updatedById, notes }
) {
  const run = await prisma.productionRun.findUnique({
    where: { id: runId },
    include: { ingredientsDeducted: true, product: true },
  });
  if (!run) throw new Error("Run not found");
  if (run.status !== "PENDING") throw new Error("Run already finalized");

  if (quantityProduced % run.product.batchSize !== 0) {
    throw new Error(`Quantity produced must be a multiple of the batch size (${run.product.batchSize}).`);
  }

  const quantityDifference = quantityProduced - run.quantityProduced;

  const recipe = await prisma.productRecipe.findMany({
    where: { productId: run.productId },
    include: { inventoryItem: true },
  });

  const ingredientIds = recipe.map((r) => r.inventoryItemId);
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { id: { in: ingredientIds } },
  });
  const inventoryItemMap = new Map(inventoryItems.map((item) => [item.id, item]));

  let totalCost = 0;
  const updatePromises = [];

  for (const ingredient of recipe) {
    const required = (quantityDifference / run.product.batchSize) * ingredient.amountRequired;
    const inventoryItem = inventoryItemMap.get(ingredient.inventoryItemId);

    if (!inventoryItem) throw new Error("Inventory item missing");
    if (inventoryItem.currentQuantity < required) {
      throw new Error(
        `Not enough ${inventoryItem.name} in stock. Required: ${required}, Available: ${inventoryItem.currentQuantity}`
      );
    }

    totalCost += (inventoryItem.cost || 0) * required;

    updatePromises.push(
      prisma.inventoryItem.update({
        where: { id: inventoryItem.id },
        data: { currentQuantity: { decrement: required } },
      })
    );
  }

  await Promise.all(updatePromises);

  const deductionPromises = recipe.map((ingredient) => {
    const required = (quantityProduced / run.product.batchSize) * ingredient.amountRequired;
    return prisma.productionIngredientDeduction.updateMany({
      where: {
        productionRunId: runId,
        inventoryItemId: ingredient.inventoryItemId,
      },
      data: {
        amountDeducted: required,
      },
    });
  });

  await Promise.all(deductionPromises);

  await prisma.product.update({
    where: { id: run.productId },
    data: { quantity: { increment: quantityDifference } },
  });

  return await prisma.productionRun.update({
    where: { id: runId },
    data: { quantityProduced, notes, updatedById, cost: run.cost + totalCost },
  });
}


// Finalize a production run
export async function finalizeProductionRun(runId, userId) {
  return prisma.productionRun.update({
    where: { id: runId },
    data: {
      status: "FINALIZED",
      finalizedAt: new Date(),
      updatedById: userId,
    },
  });
}

// List all production runs
export async function listProductionRuns({ startDate, endDate, productName, page = 1, limit = 10 }) {
  const where = {};
  const pageNum = Number(page);
  const take = Number(limit);
  const skip = (pageNum - 1) * take;

if (startDate && endDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  where.createdAt = {
    gte: start,
    lte: end,
  };
}


  if (productName) {
    where.product = {
      name: {
        contains: productName,
        mode: "insensitive",
      },
    };
  }

  const [runs, total] = await Promise.all([
    prisma.productionRun.findMany({
      where,
      include: { product: true, producedBy: true, updatedBy: true },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.productionRun.count({ where }),
  ]);

  return {
    productionRuns: runs,
      total,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(total / take),
  };
}

export async function getProductionRunById(runId) {
  const run = await prisma.productionRun.findUnique({
    where: { id: runId },
    include: {
      product: true,
      ingredientsDeducted: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  if (run) {
    run.ingredientsDeducted = run.ingredientsDeducted.map((d) => ({
      name: d.inventoryItem.name,
      amountDeducted: d.amountDeducted,
      unit: d.inventoryItem.unit,
      cost: d.amountDeducted * d.inventoryItem.cost,
    }));
  }

  return run;
}
