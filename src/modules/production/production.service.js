import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a production run
export async function createProductionRun({
  productId,
  quantityProduced,
  producedById,
  notes,
}) {
  const recipe = await prisma.productRecipe.findMany({
    where: { productId },
    include: { inventoryItem: true },
  });
  if (!recipe.length) throw new Error("No recipe found for this product");

  const ingredientIds = recipe.map((r) => r.inventoryItemId);
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { id: { in: ingredientIds } },
  });

  const inventoryItemMap = new Map(inventoryItems.map((item) => [item.id, item]));

  let totalCost = 0;
  const deductions = [];

  for (const ingredient of recipe) {
    const required = ingredient.amountRequired * quantityProduced;
    const inventoryItem = inventoryItemMap.get(ingredient.inventoryItemId);

    if (!inventoryItem) throw new Error("Inventory item missing");
    if (inventoryItem.currentQuantity < required) {
      throw new Error(`Not enough ${inventoryItem.name} in stock`);
    }

    totalCost += (inventoryItem.cost || 0) * required;
    deductions.push({
      inventoryItemId: ingredient.inventoryItemId,
      amount: required,
    });
  }

  try {
    const updatePromises = deductions.map((d) =>
      prisma.inventoryItem.update({
        where: { id: d.inventoryItemId },
        data: { currentQuantity: { decrement: d.amount } },
      })
    );
    await Promise.all(updatePromises);

    const run = await prisma.productionRun.create({
      data: {
        productId,
        quantityProduced,
        producedById,
        notes,
        status: "PENDING",
        updatedById: producedById,
        cost: totalCost,
      },
    });

    const deductionPromises = recipe.map((ingredient) => {
      const required = ingredient.amountRequired * quantityProduced;
      return prisma.productionIngredientDeduction.create({
        data: {
          productionRunId: run.id,
          inventoryItemId: ingredient.inventoryItemId,
          amountDeducted: required,
        },
      });
    });

    await Promise.all(deductionPromises);

    await prisma.product.update({
      where: { id: productId },
      data: { quantity: { increment: quantityProduced } },
    });

    return run;
  } catch (error) {
    // Rollback deductions
    const rollbackPromises = deductions.map((d) =>
      prisma.inventoryItem.update({
        where: { id: d.inventoryItemId },
        data: { currentQuantity: { increment: d.amount } },
      })
    );
    await Promise.all(rollbackPromises);
    throw error;
  }
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
    const required = ingredient.amountRequired * quantityDifference;
    const inventoryItem = inventoryItemMap.get(ingredient.inventoryItemId);

    if (!inventoryItem) throw new Error("Inventory item missing");
    if (inventoryItem.currentQuantity < required) {
      throw new Error(`Not enough ${inventoryItem.name} in stock`);
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
    const required = ingredient.amountRequired * quantityProduced;
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
export async function listProductionRuns(date) {
  const where = {};
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }
  return prisma.productionRun.findMany({
    where,
    include: { product: true, producedBy: true, updatedBy: true },
    orderBy: { createdAt: "desc" },
  });
}
