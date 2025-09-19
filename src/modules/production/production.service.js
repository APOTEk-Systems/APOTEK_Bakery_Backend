import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a production run
export async function createProductionRun({
  productId,
  quantityProduced,
  producedById,
  notes,
}) {
  console.log(`Starting production run for Product ID: ${productId}, Quantity: ${quantityProduced}`);

  // Step 1: Find the product recipe and the corresponding inventory items.
  const recipe = await prisma.productRecipe.findMany({
    where: { productId },
    include: { inventoryItem: true },
  });

  if (!recipe.length) {
    throw new Error("No recipe found for this product.");
  }

  const ingredientIds = recipe.map((r) => r.inventoryItemId);
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { id: { in: ingredientIds } },
  });

  const inventoryItemMap = new Map(inventoryItems.map((item) => [item.id, item]));

  let totalCost = 0;
  const deductions = [];

  // Step 2: Pre-check inventory levels and calculate total cost.
  for (const ingredient of recipe) {
    if (typeof ingredient.amountRequired !== "number") {
      throw new Error(
        `Invalid amountRequired for ingredient with ID ${ingredient.inventoryItemId}`
      );
    }
    const required = ingredient.amountRequired * quantityProduced;
    const inventoryItem = inventoryItemMap.get(ingredient.inventoryItemId);

    if (!inventoryItem) {
      throw new Error(
        `Inventory item with ID ${ingredient.inventoryItemId} not found.`
      );
    }

    // This is the core check for insufficient raw materials.
    if (inventoryItem.currentQuantity < required) {
      throw new Error(
        `Not enough ${inventoryItem.name} in stock. Required: ${required}, Available: ${inventoryItem.currentQuantity}.`
      );
    }

    totalCost += (inventoryItem.cost || 0) * required;
    deductions.push({
      inventoryItemId: ingredient.inventoryItemId,
      amount: required,
    });
  }

  // Step 3: Use a try/catch block for transactional-like behavior with rollback.
  try {
    // Deduct ingredients from inventory.
    const updatePromises = deductions.map((d) =>
      prisma.inventoryItem.update({
        where: { id: d.inventoryItemId },
        data: { currentQuantity: { decrement: d.amount } },
      })
    );
    await Promise.all(updatePromises);
    console.log("Ingredients successfully deducted from inventory.");

    // Create the production run record.
    const run = await prisma.productionRun.create({
      data: {
        productId,
        quantityProduced,
        producedById,
        notes,
        status: "PENDING", // Initial status
        updatedById: producedById,
        cost: totalCost,
        // The rest of the fields will be populated during finalization
      },
    });
    console.log(`Production run ${run.id} created.`);

    // Record the ingredient deductions.
    const deductionPromises = deductions.map((d) =>
      prisma.productionIngredientDeduction.create({
        data: {
          productionRunId: run.id,
          inventoryItemId: d.inventoryItemId,
          amountDeducted: d.amount,
        },
      })
    );
    await Promise.all(deductionPromises);
    console.log("Ingredient deductions recorded.");

    // Increment the product quantity in the Product table.
    await prisma.product.update({
      where: { id: productId },
      data: { quantity: { increment: quantityProduced } },
    });
    console.log(`Product quantity for ID ${productId} incremented by ${quantityProduced}.`);

    console.log("Production run successfully completed.");
    return run;
  } catch (error) {
    console.error("An error occurred during production run. Starting rollback.");
    // This is the rollback logic. It increments the inventory back up.
    const rollbackPromises = deductions.map((d) =>
      prisma.inventoryItem.update({
        where: { id: d.inventoryItemId },
        data: { currentQuantity: { increment: d.amount } },
      })
    );
    await Promise.all(rollbackPromises);
    console.log("Inventory rollback completed.");
    // Re-throw the error to be handled by the caller.
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
