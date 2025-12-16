import { PrismaClient } from "@prisma/client";
import { deductInventoryForProduction, convertPriceFromBaseUnits, convertQuantityFromBaseUnits } from "../inventory/inventory.service.js";
const prisma = new PrismaClient();

export async function getDetailedProducts() {
  const products = await prisma.product.findMany({
    include: {
      productRecipes: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  return products.map((product) => {
    const batchCost = product.productRecipes.reduce((acc, recipe) => {
      return acc + recipe.amountRequired * recipe.inventoryItem.cost;
    }, 0);

    const productionCost = product.batchSize > 0 ? batchCost / product.batchSize : 0;
    const profit = product.price - productionCost;

    return {
      name: product.name,
      price: product.price,
      productionCost,
      profit,
    };
  });
}

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
    unit: recipe.unit,
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
          unit: result.unit,
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
    run.ingredientsDeducted = run.ingredientsDeducted.map((d) => {
      // Convert amount from base units to display units
      const unit = d.unit
      const displayAmount = convertQuantityFromBaseUnits(
        d.amountDeducted,
        d.inventoryItem.unit,
        d.inventoryItem.type
      );
      // Convert cost from base units to display units
      const displayCost = convertPriceFromBaseUnits(
        d.inventoryItem.cost,
        d.inventoryItem.unit
      ) * displayAmount;
      
      return {
        name: d.inventoryItem.name,
        amountDeducted: d.amountDeducted,
        unit: d.unit,
        cost: d.cost,
      };
    });
  }

  return run;
}

export async function getProductionSummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as the start of the week

  // 1. Weekly Ingredient Usage
  const weeklyIngredientDeductions = await prisma.productionIngredientDeduction.findMany({
    where: {
      productionRun: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    },
    include: {
      inventoryItem: { select: { name: true, unit: true } },
    },
  });

  const weeklyIngredientUsageMap = new Map();
  weeklyIngredientDeductions.forEach(deduction => {
    const ingredientName = deduction.inventoryItem.name;
    const unit = deduction.inventoryItem.unit;
    const amount = deduction.amountDeducted;

    if (weeklyIngredientUsageMap.has(ingredientName)) {
        const existing = weeklyIngredientUsageMap.get(ingredientName);
        weeklyIngredientUsageMap.set(ingredientName, {
            quantity: existing.quantity + amount,
            unit: unit,
        });
    } else {
        weeklyIngredientUsageMap.set(ingredientName, { quantity: amount, unit: unit });
    }
  });

  let weeklyIngredientUsageList = Array.from(weeklyIngredientUsageMap.entries()).map(([name, data]) => ({
    name,
    quantity: data.quantity,
    unit: data.unit,
  }));

  // Now, get the available quantity for each ingredient in the list
  const ingredientNames = weeklyIngredientUsageList.map(item => item.name);
  const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
          name: {
              in: ingredientNames
          }
      },
      select: {
          name: true,
          currentQuantity: true,
          unit: true,
          type: true
      }
  });
  const inventoryQuantityMap = new Map(inventoryItems.map(item => [
    item.name,
    convertQuantityFromBaseUnits(item.currentQuantity, item.unit, item.type)
  ]));

  weeklyIngredientUsageList = weeklyIngredientUsageList.map(item => ({
      ...item,
      available: inventoryQuantityMap.get(item.name) || 0
  }));

  // 2. Weekly Production (aggregated products)
  const weeklyProductionRuns = await prisma.productionRun.findMany({
    where: {
      createdAt: {
        gte: startOfWeek,
      },
    },
    include: {
      product: { select: { name: true, batchSize: true } },
    },
  });

  const weeklyProductionMap = new Map();
  weeklyProductionRuns.forEach(run => {
    const productName = run.product.name;
    const quantity = run.quantityProduced;
    const cost = run.cost;
    const batchSize = run.product.batchSize;

    if (weeklyProductionMap.has(productName)) {
      const existing = weeklyProductionMap.get(productName);
      weeklyProductionMap.set(productName, {
        quantity: existing.quantity + quantity,
        cost: existing.cost + cost,
        batchSize: batchSize, 
      });
    } else {
      weeklyProductionMap.set(productName, { quantity, cost, batchSize });
    }
  });

  const weeklyProductionList = Array.from(weeklyProductionMap.entries()).map(([name, data]) => {
    const costPerBatch = data.batchSize > 0 && data.quantity > 0 ? data.cost  : 0;
    return {
      productName: name,
      quantityProduced: data.quantity,
      cost: costPerBatch,
    };
  });

  // 3. Production Vs Sales (Weekly)
  const weeklySales = await prisma.saleItem.findMany({
    where: {
      sale: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    },
    include: {
      product: { select: { name: true } },
    },
  });

  const weeklySalesMap = new Map();
  weeklySales.forEach(item => {
    const productName = item.product.name;
    const quantity = item.quantity;

    if (weeklySalesMap.has(productName)) {
      weeklySalesMap.set(productName, weeklySalesMap.get(productName) + quantity);
    } else {
      weeklySalesMap.set(productName, quantity);
    }
  });

  const allProductNames = new Set([...weeklyProductionMap.keys(), ...weeklySalesMap.keys()]);

  const productionVsSalesList = Array.from(allProductNames).map(productName => {
    const produced = weeklyProductionMap.get(productName)?.quantity || 0;
    const sold = weeklySalesMap.get(productName) || 0;
    return {
      productName,
      produced,
      sold,
      difference: produced - sold,
    };
  });


  return {
    weeklyIngredientUsage: {
      count: weeklyIngredientUsageList.length,
      items: weeklyIngredientUsageList,
    },
    weeklyProduction: {
      count: weeklyProductionList.length,
      items: weeklyProductionList,
    },
    productionVsSales: {
      count: productionVsSalesList.length,
      items: productionVsSalesList,
    },
  };
}
